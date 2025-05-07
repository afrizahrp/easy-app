import { useQuery } from '@tanstack/react-query';
import { api } from '@/config/axios.config';
import { AxiosError } from 'axios';
import { useSessionStore } from '@/store';
import { useMonthYearPeriodStore } from '@/store';
import { format } from 'date-fns';

interface SalespersonSummary {
  salesPersonName: string;
  period: string;
  totalInvoice: number;
  previousYearInvoice: number;
  growthPercentage: number;
  highestMonth: { month: string; amount: number };
  lowestMonth: { month: string; amount: number };
  averageMonthlySales: number;
  targetSalesSuggestion: number;
  months: { month: string; amount: number }[];
}

interface UseSalespersonFilteredSummaryProps {
  salesPersonName?: string;
  startPeriod?: string;
  endPeriod?: string;
}

const useSalespersonFilteredSummary = ({
  salesPersonName,
  startPeriod,
  endPeriod,
}: UseSalespersonFilteredSummaryProps) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase() || '';
  const module_id = 'dsb'; // Sesuaikan dengan modul Anda
  const subModule_id = 'sls';

  const { salesPersonInvoicePeriod } = useMonthYearPeriodStore();
  const isValidRequest = Boolean(company_id && module_id && subModule_id);

  // Gunakan periode dari store jika tidak disediakan
  const effectiveStartPeriod =
    startPeriod ||
    format(salesPersonInvoicePeriod.startPeriod || new Date(), 'MMMyyyy');
  const effectiveEndPeriod =
    endPeriod ||
    format(salesPersonInvoicePeriod.endPeriod || new Date(), 'MMMyyyy');

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalespersonSummary,
    AxiosError
  >({
    queryKey: [
      'salespersonFilteredSummary',
      company_id,
      module_id,
      subModule_id,
      salesPersonName,
      effectiveStartPeriod,
      effectiveEndPeriod,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('startPeriod', effectiveStartPeriod);
      params.append('endPeriod', effectiveEndPeriod);
      if (salesPersonName) params.append('salesPersonName', salesPersonName);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/getSalespersonFilteredSummary`;
      const finalUrl = `${url}?${params.toString()}`;

      try {
        const response = await api.get<{ data: SalespersonSummary }>(finalUrl);
        return response.data.data; // Asumsi endpoint mengembalikan { data: ... }
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        throw new Error(
          axiosError.response?.data?.message ||
            'Failed to fetch salesperson summary'
        );
      }
    },
    enabled: isValidRequest && !!salesPersonName, // Aktifkan hanya jika salesPersonName ada
    staleTime: 5 * 60 * 1000, // 5 menit
  });

  return {
    data,
    isLoading,
    isFetching,
    error,
    ...rest,
  };
};

export default useSalespersonFilteredSummary;

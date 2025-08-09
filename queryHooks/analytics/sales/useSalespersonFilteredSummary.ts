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
  companyIds?: string[]; // Tambahkan parameter untuk multiple company_id
}

const useSalespersonFilteredSummary = ({
  salesPersonName,
  startPeriod,
  endPeriod,
  companyIds, // Tambahkan parameter companyIds
}: UseSalespersonFilteredSummaryProps) => {
  const user = useSessionStore((state) => state.user);
  const defaultCompany_id = user?.company_id?.toUpperCase() || '';
  const module_id = 'dsb';
  const subModule_id = 'sls';

  // Gunakan companyIds jika disediakan, jika tidak gunakan default dari user
  const effectiveCompanyIds =
    companyIds && companyIds.length > 0
      ? companyIds.map((id) => id.toUpperCase())
      : [defaultCompany_id];

  const { salesPersonInvoicePeriod } = useMonthYearPeriodStore();
  const isValidRequest = Boolean(
    effectiveCompanyIds.length > 0 &&
      effectiveCompanyIds.every((id) => id) &&
      module_id &&
      subModule_id
  );

  // Gunakan periode dari store jika tidak disediakan, pastikan tanpa spasi
  const normalizePeriod = (period: string | Date): string => {
    if (typeof period === 'string') return period.replace(/\s+/g, '');
    return format(period, 'MMMyyyy').replace(/\s+/g, '');
  };

  const effectiveStartPeriod =
    startPeriod ||
    normalizePeriod(salesPersonInvoicePeriod.startPeriod || new Date());
  const effectiveEndPeriod =
    endPeriod ||
    normalizePeriod(salesPersonInvoicePeriod.endPeriod || new Date());

  // Log untuk debug
  // console.log('Effective periods:', {
  //   salesPersonName,
  //   startPeriod,
  //   endPeriod,
  //   effectiveStartPeriod,
  //   effectiveEndPeriod,
  // });

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalespersonSummary,
    AxiosError
  >({
    queryKey: [
      'salespersonFilteredSummary',
      effectiveCompanyIds, // Gunakan effectiveCompanyIds dalam queryKey
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

      // Tambahkan multiple company_id parameters
      effectiveCompanyIds.forEach((companyId) => {
        params.append('company_id', companyId);
      });

      // Gunakan base URL dari environment variable
      const baseURL = process.env.NEXT_PUBLIC_API_URL;
      const url = `${baseURL}/dsb/sls/get-analytics/getSalespersonFilteredSummary`;
      const finalUrl = `${url}?${params.toString()}`;

      try {
        // Asumsi API mengembalikan { data: SalespersonSummary[] }
        const response = await api.get<{ data: SalespersonSummary[] }>(
          finalUrl
        );
        const responseData = response.data.data;

        // Pastikan data adalah array dan tidak kosong
        if (!Array.isArray(responseData) || responseData.length === 0) {
          throw new Error('No salesperson summary data found');
        }

        // Ambil objek pertama dari array
        return responseData[0];
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        throw new Error(
          axiosError.response?.data?.message ||
            'Failed to fetch salesperson summary'
        );
      }
    },
    enabled: isValidRequest && !!salesPersonName,
    staleTime: 5 * 60 * 1000,
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

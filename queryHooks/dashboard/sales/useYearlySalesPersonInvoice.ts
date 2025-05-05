import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useMonthYearPeriodStore } from '@/store';
import { format, isValid } from 'date-fns';
import { AxiosError } from 'axios';

interface SalesDataWithoutFilter {
  period: string;
  totalInvoice: number;
  months: {
    month: string;
    sales: { salesPersonName: string; amount: number }[];
  }[];
}

interface SalesPeriodResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: SalesDataWithoutFilter[];
}

interface UseMonthlySalesPersonInvoiceProps {
  context: 'salesPersonInvoice';
}

const useMonthlySalesPersonInvoice = ({
  context,
}: UseMonthlySalesPersonInvoiceProps) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'SLS';
  const subModule_id = 'sls';

  const { salesPersonInvoicePeriod } = useMonthYearPeriodStore();

  const isValidRequest = Boolean(company_id && module_id && subModule_id);

  // Validasi dan format periode
  const getFormattedPeriod = (date: Date | null, defaultDate: Date): string => {
    return date && isValid(date)
      ? format(date, 'MMMyyyy')
      : format(defaultDate, 'MMMyyyy');
  };

  const defaultStartPeriod = new Date(new Date().getFullYear(), 0, 1); // 1 Januari tahun berjalan
  const defaultEndPeriod = new Date(); // Tanggal saat ini

  const formattedStartPeriod = getFormattedPeriod(
    salesPersonInvoicePeriod.startPeriod,
    defaultStartPeriod
  );
  const formattedEndPeriod = getFormattedPeriod(
    salesPersonInvoicePeriod.endPeriod,
    defaultEndPeriod
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesPeriodResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      'salesPersonChartUnfiltered',
      context,
      company_id,
      module_id,
      subModule_id,
      formattedStartPeriod,
      formattedEndPeriod,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('startPeriod', formattedStartPeriod);
      params.append('endPeriod', formattedEndPeriod);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-analytics/getMonthlySalespersonInvoice`;
      const finalUrl = `${url}?${params.toString()}`;

      try {
        const response = await api.get<SalesPeriodResponse>(finalUrl);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        throw new Error(
          axiosError.response?.data?.message || 'Failed to fetch sales data'
        );
      }
    },
    enabled: isValidRequest,
    staleTime: 60 * 1000,
    retry: (failureCount, err) => {
      if (err instanceof AxiosError && err.response?.status === 400) {
        return false;
      }
      return failureCount < 2;
    },
  });

  return {
    data: data?.data ?? [],
    isLoading,
    isFetching,
    error,
    ...rest,
  };
};

export default useMonthlySalesPersonInvoice;

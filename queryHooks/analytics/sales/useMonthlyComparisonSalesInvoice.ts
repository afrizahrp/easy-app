import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useMonthYearPeriodStore } from '@/store';
import { format } from 'date-fns';
import { AxiosError } from 'axios';

interface MonthlyData {
  amount: number;
  growthPercentage: number | null;
}

interface SalesInvoiceComparisonData {
  period: string;
  totalInvoice: number;
  months: { [month: string]: MonthlyData };
}

interface SalesPeriodResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: SalesInvoiceComparisonData[];
}

interface UseMonthlyComparisonSalesInvoiceParams {
  context: 'salesInvoice' | 'salesPersonInvoice';
}

const useMonthlyComparisonSalesInvoice = ({
  context,
}: UseMonthlyComparisonSalesInvoiceParams) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'ANT';
  const subModule_id = 'sls';

  const { salesInvoicePeriod, salesPersonInvoicePeriod } =
    useMonthYearPeriodStore();
  const period =
    context === 'salesInvoice' ? salesInvoicePeriod : salesPersonInvoicePeriod;

  const isValidRequest = Boolean(
    company_id &&
      module_id &&
      subModule_id &&
      period.startPeriod &&
      period.endPeriod
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesPeriodResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      'monthlyComparisonSalesInvoice',
      context,
      company_id,
      module_id,
      subModule_id,
      period.startPeriod,
      period.endPeriod,
    ],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error(
          'Invalid request parameters: company_id, module_id, subModule_id, startPeriod, and endPeriod are required'
        );
      }

      const params = new URLSearchParams();

      if (period.startPeriod) {
        params.append('startPeriod', format(period.startPeriod, 'MMMyyyy'));
      }
      if (period.endPeriod) {
        params.append('endPeriod', format(period.endPeriod, 'MMMyyyy'));
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-analytics/getMonthlyComparisonSalesInvoice`;
      const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;

      console.log(`[useMonthlySalesInvoice:${context}] finalUrl:`, finalUrl);

      try {
        const response = await api.get<SalesPeriodResponse>(finalUrl);

        console.log('response:', response.data);

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

export default useMonthlyComparisonSalesInvoice;

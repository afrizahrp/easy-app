import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useMonthYearPeriodStore } from '@/store';
import { format } from 'date-fns';
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

const useSalesByPeriodUnfiltered = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'SLS';
  const subModule_id = 'sls';

  const { startPeriod, endPeriod } = useMonthYearPeriodStore();

  const isValidRequest = Boolean(
    company_id &&
      module_id &&
      startPeriod instanceof Date &&
      endPeriod instanceof Date
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesPeriodResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      'salesPersonChartUnfiltered',
      company_id,
      module_id,
      subModule_id,
      startPeriod,
      endPeriod,
    ],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request parameters');
      }

      const params = new URLSearchParams();

      if (startPeriod) {
        params.append('startPeriod', format(startPeriod, 'MMMyyyy'));
      }
      if (endPeriod) {
        params.append('endPeriod', format(endPeriod, 'MMMyyyy'));
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-dashboard/getByTopNSalesPersonByPeriod`;
      const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;

      console.log('Query params:', params.toString());
      console.log('finalUrl:', finalUrl);

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

export default useSalesByPeriodUnfiltered;

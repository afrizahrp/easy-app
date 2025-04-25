import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useMonthYearPeriodStore } from '@/store';
import { format } from 'date-fns';

interface SalesPeriodResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: {
    period: string;
    totalInvoice: number;
    months: Record<string, number>;
  }[];
}

const useSalesByPeriod = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'dsb';
  const subModule_id = 'sls';

  const { startPeriod, endPeriod } = useMonthYearPeriodStore();

  const isValidRequest = Boolean(
    company_id && module_id && startPeriod && endPeriod
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesPeriodResponse,
    Error
  >({
    queryKey: [
      'salesPeriodComparison',
      company_id,
      module_id,
      subModule_id,
      startPeriod,
      endPeriod,
    ],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-dashboard/getByPeriod`;

      const response = await api.get<SalesPeriodResponse>(url, {
        params: {
          startPeriod: format(startPeriod!, 'MMMyyyy'),
          endPeriod: format(endPeriod!, 'MMMyyyy'),
        },
      });

      // console.log('response data', response.data);

      return response.data;
    },
    enabled: isValidRequest,
    staleTime: 60 * 1000,
    retry: 2,
  });

  return {
    data: data?.data ?? [],
    isLoading,
    isFetching,
    error,
    ...rest,
  };
};

export default useSalesByPeriod;

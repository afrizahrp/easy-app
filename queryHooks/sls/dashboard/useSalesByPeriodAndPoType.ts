import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useSalesInvoiceHdFilterStore,
  useMonthYearPeriodStore,
} from '@/store';
import { format } from 'date-fns';
import { AxiosError } from 'axios';

interface SalesByPoTypeResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: {
    period: string;
    poType: string;
    totalInvoice: number;
    months: Record<string, number>;
  }[];
}

const useSalesByPeriodAndPoType = (poTypes?: string[]) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'ANT';
  const subModule_id = 'sls';

  const { startPeriod, endPeriod } = useMonthYearPeriodStore();
  const { poType: storePoType } = useSalesInvoiceHdFilterStore((state) => ({
    poType: state.poType,
  }));

  const isValidRequest = Boolean(
    company_id &&
      module_id &&
      subModule_id &&
      startPeriod &&
      endPeriod &&
      startPeriod instanceof Date &&
      endPeriod instanceof Date
  );

  const validPoTypes =
    poTypes && Array.isArray(poTypes) && poTypes.length
      ? poTypes.filter((poType) => typeof poType === 'string' && poType.trim())
      : storePoType?.length
        ? storePoType.filter(
            (poType) => typeof poType === 'string' && poType.trim()
          )
        : [];

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesByPoTypeResponse,
    Error
  >({
    queryKey: [
      'salesByPeriodAndPoType',
      company_id,
      module_id,
      subModule_id,
      startPeriod,
      endPeriod,
      validPoTypes,
    ],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-analytics/getSalesByPoTypeByPeriod`;

      const startPeriodFormatted = format(startPeriod!, 'MMMyyyy');
      const endPeriodFormatted = format(endPeriod!, 'MMMyyyy');

      const params: Record<string, string | string[]> = {
        startPeriod: startPeriodFormatted,
        endPeriod: endPeriodFormatted,
      };

      if (validPoTypes.length > 0) {
        params.poType = validPoTypes; // Send as array if multiple poTypes
      }

      try {
        const response = await api.get<SalesByPoTypeResponse>(url, {
          params,
          paramsSerializer: (params) => {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                value.forEach((val) => searchParams.append(key, val));
              } else {
                searchParams.append(key, value);
              }
            });
            return searchParams.toString();
          },
        });
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

export default useSalesByPeriodAndPoType;

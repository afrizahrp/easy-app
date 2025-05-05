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

interface UseMonthlySalesInvoiceByPoTypeProps {
  context: 'salesInvoice';
  poTypes?: string[];
}

const useMonthlySalesInvoiceByPoType = ({
  context,
  poTypes,
}: UseMonthlySalesInvoiceByPoTypeProps) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'SLS'; // Sesuaikan dengan SalesInvoiceList
  const subModule_id = 'sls';

  const { salesInvoicePeriod, salesPersonInvoicePeriod } =
    useMonthYearPeriodStore();
  const { salesInvoiceFilters } = useSalesInvoiceHdFilterStore();

  const { poType: storePoType } = salesInvoiceFilters;

  // const isValidRequest = Boolean(company_id && module_id && subModule_id);

  const period =
    context === 'salesInvoice' ? salesInvoicePeriod : salesPersonInvoicePeriod;

  const isValidRequest = Boolean(
    company_id &&
      module_id &&
      subModule_id &&
      period.startPeriod &&
      period.endPeriod
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
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      'salesByPeriodAndPoType',
      context,
      company_id,
      module_id,
      subModule_id,
      period.startPeriod,
      period.endPeriod,
      validPoTypes,
    ],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-analytics/getMonthlySalesInvoiceByPoType`;

      const params = new URLSearchParams();

      if (period.startPeriod) {
        params.append('startPeriod', format(period.startPeriod, 'MMMyyyy'));
      }
      if (period.endPeriod) {
        params.append('endPeriod', format(period.endPeriod, 'MMMyyyy'));
      }

      if (validPoTypes.length > 0) {
        validPoTypes.forEach((poType) => params.append('poType', poType));
      }

      const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;

      try {
        const response = await api.get<SalesByPoTypeResponse>(finalUrl);
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

export default useMonthlySalesInvoiceByPoType;

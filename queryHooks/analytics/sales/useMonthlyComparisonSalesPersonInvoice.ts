import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useSalesInvoiceHdFilterStore,
  useMonthYearPeriodStore,
} from '@/store';
import { format } from 'date-fns';
import { AxiosError } from 'axios';

interface SalesData {
  period: string;
  totalInvoice: number;
  months: {
    month: string;
    sales: {
      salesPersonName: string;
      amount: number;
      growthPercentage: number | null;
    }[];
  }[];
}

interface SalesPeriodResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: SalesData[];
}

interface UseMonthlyComparisonSalesPersonInvoiceProps {
  context: 'salesPersonInvoice';
  salesPersonNames: string[];
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number | false;
}

const useMonthlyComparisonSalesPersonInvoice = ({
  context,
  salesPersonNames,
  refetchOnWindowFocus,
  refetchInterval,
}: UseMonthlyComparisonSalesPersonInvoiceProps) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'ANT';
  const subModule_id = 'sls';

  const { salesPersonInvoicePeriod } = useMonthYearPeriodStore();
  const { salesPersonInvoiceFilters } = useSalesInvoiceHdFilterStore();

  const { salesPersonName: storeSalesPersonName } = salesPersonInvoiceFilters;

  const isValidRequest = Boolean(company_id && module_id && subModule_id);

  const validSalesPersonNames = salesPersonNames.length
    ? salesPersonNames.filter((name) => typeof name === 'string' && name.trim())
    : storeSalesPersonName.length
      ? storeSalesPersonName.filter(
          (name) => typeof name === 'string' && name.trim()
        )
      : [];

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesPeriodResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      'monthlyComparisonSalesPersonInvoice',
      context,
      company_id,
      module_id,
      subModule_id,
      salesPersonInvoicePeriod.startPeriod,
      salesPersonInvoicePeriod.endPeriod,
      validSalesPersonNames,
    ],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request parameters');
      }

      const params = new URLSearchParams();

      if (salesPersonInvoicePeriod.startPeriod) {
        params.append(
          'startPeriod',
          format(salesPersonInvoicePeriod.startPeriod, 'MMMyyyy')
        );
      }
      if (salesPersonInvoicePeriod.endPeriod) {
        params.append(
          'endPeriod',
          format(salesPersonInvoicePeriod.endPeriod, 'MMMyyyy')
        );
      }

      // Only append salesPersonName if validSalesPersonNames is non-empty
      if (validSalesPersonNames.length > 0) {
        validSalesPersonNames.forEach((name) => {
          params.append('salesPersonName', name);
        });
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-analytics/getMonthlyComparisonSalesPersonInvoice`;
      const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;

      try {
        const response = await api.get<SalesPeriodResponse>(finalUrl);
        console.log(
          `[useMonthlyComparisonSalesPersonInvoice:${context}] response.data:`,
          JSON.stringify(response.data, null, 2)
        );
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        throw new Error(
          axiosError.response?.data?.message || 'Failed to fetch sales data'
        );
      }
    },
    enabled: isValidRequest, // Allow query to run even if validSalesPersonNames is empty
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: refetchOnWindowFocus ?? false,
    refetchInterval: refetchInterval ?? false,
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

export default useMonthlyComparisonSalesPersonInvoice;

import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useSalesInvoiceHdFilterStore,
  useMonthYearPeriodStore,
} from '@/store';
import { format } from 'date-fns';
import { AxiosError } from 'axios';

interface MonthlyData {
  amount: number;
  growthPercentage: number | null;
}

interface SalesPersonInvoiceComparisonData {
  period: string;
  totalInvoice: number;
  salesPersonName: string;
  months: { [month: string]: MonthlyData };
}

interface SalesPeriodResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: SalesPersonInvoiceComparisonData[];
}

interface UseMonthlyComparisonSalesPersonInvoiceFilteredProps {
  context: 'salesPersonInvoice';
  salesPersonNames: string[];
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number | false;
}

const useMonthlyComparisonSalesPersonInvoiceFiltered = ({
  context,
  salesPersonNames,
  refetchOnWindowFocus,
  refetchInterval,
}: UseMonthlyComparisonSalesPersonInvoiceFilteredProps) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'ANT';
  const subModule_id = 'sls';

  const { salesPersonInvoicePeriod } = useMonthYearPeriodStore();
  const { salesPersonInvoiceFilters } = useSalesInvoiceHdFilterStore();

  const { salesPersonName: storeSalesPersonName } = salesPersonInvoiceFilters;

  const isValidRequest = Boolean(
    company_id &&
      module_id &&
      subModule_id &&
      salesPersonNames &&
      salesPersonNames.length > 0
  );

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
      if (!isValidRequest || !validSalesPersonNames.length) {
        throw new Error(
          'Invalid request parameters: salesPersonNames is required'
        );
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

      validSalesPersonNames.forEach((name) => {
        params.append('salesPersonName', name);
      });

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-analytics/getMonthlyComparisonSalesPersonInvoice`;
      const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;

      console.log(
        `[useMonthlyComparisonSalesPersonInvoiceFiltered:${context}] finalUrl:`,
        finalUrl
      );

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
    enabled: isValidRequest && validSalesPersonNames.length > 0,
    staleTime: 5 * 60 * 1000, // 5 menit
    refetchOnWindowFocus: false,
    refetchInterval: false,
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

export default useMonthlyComparisonSalesPersonInvoiceFiltered;

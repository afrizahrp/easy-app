import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useMonthYearPeriodStore } from '@/store';
import { format } from 'date-fns';
import { AxiosError } from 'axios';

// Tipe untuk respons
interface SalesDataWithoutFilter {
  period: string;
  totalInvoice: number;
  months: {
    month: string;
    sales: { salesPersonName: string; amount: number }[];
  }[];
}

interface SalesDataWithFilter {
  period: string;
  totalInvoice: number;
  salesPersonName: string;
  months: { month: string; amount: number }[];
}

interface SalesPeriodResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: SalesDataWithoutFilter[] | SalesDataWithFilter[];
}

interface UseSalesPersonByPeriodProps {
  salesPersonNames?: string[];
  // topN?: number; // Tambahkan parameter topN
}

const useSalesPersonByPeriod = ({
  salesPersonNames,
  // topN,
}: UseSalesPersonByPeriodProps = {}) => {
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

  const validSalesPersonNames = Array.isArray(salesPersonNames)
    ? salesPersonNames.filter((name) => typeof name === 'string' && name.trim())
    : undefined;

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesPeriodResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      'salesPeriodComparison',
      company_id,
      module_id,
      subModule_id,
      startPeriod,
      endPeriod,
      validSalesPersonNames,
      // topN,
    ],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request parameters');
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-dashboard/getBySalesPersonByPeriod`;

      const params: Record<string, any> = {
        startPeriod: format(startPeriod!, 'MMMyyyy'),
        endPeriod: format(endPeriod!, 'MMMyyyy'),
      };

      if (validSalesPersonNames && validSalesPersonNames.length > 0) {
        params.salesPersonName = validSalesPersonNames;
      }
      // if (topN) {
      //   params.topN = topN;
      // }

      try {
        const response = await api.get<SalesPeriodResponse>(url, { params });
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

export default useSalesPersonByPeriod;

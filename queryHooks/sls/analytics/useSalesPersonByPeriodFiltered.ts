import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useSalesInvoiceHdFilterStore,
  useMonthYearPeriodStore,
} from '@/store';
import { format } from 'date-fns';
import { AxiosError } from 'axios';

interface SalesDataWithFilter {
  period: string;
  totalInvoice: number;
  salesPersonName: string;
  months: { [month: string]: number }; // Sesuai dengan response backend
}

interface SalesPeriodResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: SalesDataWithFilter[];
}

interface UseSalesByPeriodFilteredProps {
  salesPersonNames: string[];
}

const useSalesByPeriodFiltered = ({
  salesPersonNames,
}: UseSalesByPeriodFilteredProps) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'SLS';
  const subModule_id = 'sls';

  const { startPeriod, endPeriod } = useMonthYearPeriodStore();
  const { salesPersonName: storeSalesPersonName } =
    useSalesInvoiceHdFilterStore((state) => ({
      salesPersonName: state.salesPersonName,
      poType: state.poType,
      paidStatus: state.paidStatus,
    }));

  const isValidRequest = Boolean(
    company_id &&
      module_id &&
      startPeriod instanceof Date &&
      endPeriod instanceof Date &&
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
      'salesPersonChartFiltered',
      company_id,
      module_id,
      subModule_id,
      startPeriod,
      endPeriod,
      validSalesPersonNames,
    ],
    queryFn: async () => {
      if (!isValidRequest || !validSalesPersonNames.length) {
        throw new Error(
          'Invalid request parameters: salesPersonNames is required'
        );
      }

      const params = new URLSearchParams();

      if (startPeriod) {
        params.append('startPeriod', format(startPeriod, 'MMMyyyy'));
      }
      if (endPeriod) {
        params.append('endPeriod', format(endPeriod, 'MMMyyyy'));
      }

      validSalesPersonNames.forEach((name) => {
        params.append('salesPersonName', name);
      });

      const url = `http://localhost:8000/BIS/SLS/sls/get-dashboard/getBySalesPersonByPeriod`;
      const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;

      console.log('validSalesPersonNames:', validSalesPersonNames);
      console.log('Query params:', params.toString());
      console.log('finalUrl:', finalUrl);

      try {
        const response = await api.get<SalesPeriodResponse>(finalUrl, {
          paramsSerializer: (params) => params.toString(),
        });
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        throw new Error(
          axiosError.response?.data?.message || 'Failed to fetch sales data'
        );
      }
    },
    enabled: isValidRequest && validSalesPersonNames.length > 0,
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

export default useSalesByPeriodFiltered;

import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useSalesInvoiceHdFilterStore,
  useMonthYearPeriodStore,
} from '@/store';
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
  context: 'salesInvoice' | 'salesPersonInvoice';
  salesPersonNames?: string[];
}

const useSalesPersonByPeriod = ({
  context,
  salesPersonNames: propSalesPersonNames,
}: UseSalesPersonByPeriodProps) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'SLS';
  const subModule_id = 'sls';

  const { salesInvoicePeriod, salesPersonInvoicePeriod } =
    useMonthYearPeriodStore();
  const { salesInvoiceFilters, salesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore();

  const period =
    context === 'salesInvoice' ? salesInvoicePeriod : salesPersonInvoicePeriod;
  const filters =
    context === 'salesInvoice'
      ? salesInvoiceFilters
      : salesPersonInvoiceFilters;

  const { salesPersonName, paidStatus, poType } = filters;

  const isValidRequest = Boolean(company_id && module_id && subModule_id);

  // Gunakan salesPersonName dari store jika propSalesPersonNames tidak diberikan
  const salesPersonNames = propSalesPersonNames ?? salesPersonName;

  // Validasi salesPersonNames
  const validSalesPersonNames = Array.isArray(salesPersonNames)
    ? salesPersonNames.filter((name) => typeof name === 'string' && name.trim())
    : salesPersonNames &&
        typeof salesPersonNames === 'string' &&
        salesPersonNames
      ? [salesPersonNames]
      : [];

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesPeriodResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      'salesPersonChart',
      context,
      company_id,
      module_id,
      subModule_id,
      period.startPeriod,
      period.endPeriod,
      validSalesPersonNames,
      paidStatus,
      poType,
    ],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request parameters');
      }

      const hasSalesPersonNames = validSalesPersonNames.length > 0;

      const params = new URLSearchParams();

      // Tambahkan periode jika ada
      if (period.startPeriod) {
        params.append('startPeriod', format(period.startPeriod, 'MMMyyyy'));
      }
      if (period.endPeriod) {
        params.append('endPeriod', format(period.endPeriod, 'MMMyyyy'));
      }

      // Tambahkan filter
      if (hasSalesPersonNames) {
        validSalesPersonNames.forEach((name) => {
          params.append('salesPersonName', name);
        });
      }

      if (paidStatus?.length) {
        paidStatus.forEach((status) => {
          params.append('paidStatus', status);
        });
      }

      if (poType?.length && context === 'salesInvoice') {
        poType.forEach((type) => {
          params.append('poType', type);
        });
      }

      const endpoint = hasSalesPersonNames
        ? 'getBySalesPersonByPeriod'
        : 'getByTopNSalesPersonByPeriod';

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-dashboard/${endpoint}`;

      const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;

      console.log(
        `[useSalesPersonByPeriod:${context}] validSalesPersonNames:`,
        validSalesPersonNames
      );
      console.log(
        `[useSalesPersonByPeriod:${context}] Query params:`,
        params.toString()
      );
      console.log(`[useSalesPersonByPeriod:${context}] finalUrl:`, finalUrl);

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

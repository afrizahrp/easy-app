import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useMonthYearPeriodStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';
import { format } from 'date-fns';

interface SalesInvoiceHdSalesPerson {
  id: string;
  name: string;
  count: number;
}

interface SalesInvoiceHdSalesPersonResponse {
  data: SalesInvoiceHdSalesPerson[];
}

interface UseSalesInvoiceHdSalesPersonParams {
  context: 'salesInvoice' | 'salesPersonInvoice';
}

export const useSalesInvoiceHdSalesPerson = ({
  context,
}: UseSalesInvoiceHdSalesPersonParams) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'SLS';

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

  const { paidStatus, poType } = filters;

  const isEnabled = !!company_id && !!module_id;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdSalesPersonResponse,
    Error
  >({
    queryKey: [
      'salesPersonName',
      context,
      company_id,
      module_id,
      period.startPeriod,
      period.endPeriod,
      paidStatus,
      poType,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (period.startPeriod) {
        params.append('startPeriod', format(period.startPeriod, 'MMMyyyy'));
      }

      if (period.endPeriod) {
        params.append('endPeriod', format(period.endPeriod, 'MMMyyyy'));
      }

      if (poType?.length) {
        poType.forEach((name) => {
          params.append('poType', name);
        });
      }

      if (paidStatus?.length) {
        paidStatus.forEach((name) => {
          params.append('paidStatus', name);
        });
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd/getSalesPerson${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      const response = await api.get<SalesInvoiceHdSalesPersonResponse>(url);
      return response.data;
    },
    enabled: isEnabled,
    staleTime: 60 * 1000,
    retry: 3,
  });

  return {
    data: data?.data,
    isLoading,
    error,
    isFetching,
    ...rest,
  };
};

export default useSalesInvoiceHdSalesPerson;

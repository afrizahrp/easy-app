import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useMonthYearPeriodStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';
import { format } from 'date-fns';

interface SalesInvoiceHdPOType {
  id: string;
  name: string;
  count: number;
}

interface SalesInvoiceHdPoTypeResponse {
  data: SalesInvoiceHdPOType[];
}

interface UseSalesInvoiceHdPoTypeParams {
  context: 'salesInvoice';
}

export const useSalesInvoiceHdPoType = ({
  context,
}: UseSalesInvoiceHdPoTypeParams) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'SLS';

  const { salesInvoicePeriod } = useMonthYearPeriodStore();
  const { salesInvoiceFilters } = useSalesInvoiceHdFilterStore();

  const { salesPersonName, paidStatus } = salesInvoiceFilters;

  const isEnabled = !!company_id && !!module_id && salesPersonName.length <= 1;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdPoTypeResponse,
    Error
  >({
    queryKey: [
      'SalesInvoiceHdPoType',
      context,
      company_id,
      module_id,
      salesInvoicePeriod.startPeriod,
      salesInvoicePeriod.endPeriod,
      paidStatus,
      salesPersonName,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (salesPersonName?.length) {
        salesPersonName.forEach((name) => {
          params.append('salesPersonName', name);
        });
      }

      if (paidStatus?.length) {
        paidStatus.forEach((name) => {
          params.append('paidStatus', name);
        });
      }

      if (salesInvoicePeriod.startPeriod) {
        params.append(
          'startPeriod',
          format(salesInvoicePeriod.startPeriod, 'MMMyyyy')
        );
      }

      if (salesInvoicePeriod.endPeriod) {
        params.append(
          'endPeriod',
          format(salesInvoicePeriod.endPeriod, 'MMMyyyy')
        );
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd/getPoType${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      const response = await api.get<SalesInvoiceHdPoTypeResponse>(url);

      console.log(
        `[useSalesInvoiceHdPoType:${context}] URL: ${url}, Response: ${JSON.stringify(response.data)}`
      );

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

export default useSalesInvoiceHdPoType;

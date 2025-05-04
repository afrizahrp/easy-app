import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useMonthYearPeriodStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';
import { format } from 'date-fns';

interface SalesInvoiceHdStatus {
  id: string;
  name: string;
  count: number;
}

interface SalesInvoiceHdStatusResponse {
  data: SalesInvoiceHdStatus[];
}

interface UseSalesInvoiceHdPaidStatusParams {
  context: 'salesInvoice' | 'salesPersonInvoice';
}

export const useSalesInvoiceHdPaidStatus = ({
  context,
}: UseSalesInvoiceHdPaidStatusParams) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'SLS';

  // Ambil periode dan filter berdasarkan context
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

  const { poType, salesPersonName } = filters;

  // Hanya aktif jika company_id, module_id valid, dan salesPersonName <= 1
  const isEnabled = !!company_id && !!module_id && salesPersonName.length <= 1;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdStatusResponse,
    Error
  >({
    queryKey: [
      'salesInvoiceHdStatus',
      context,
      company_id,
      module_id,
      period.startPeriod,
      period.endPeriod,
      poType,
      salesPersonName,
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

      if (salesPersonName?.length) {
        salesPersonName.forEach((name) => {
          params.append('salesPersonName', name);
        });
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd/getPaidStatus${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      const response = await api.get<SalesInvoiceHdStatusResponse>(url);
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

export default useSalesInvoiceHdPaidStatus;

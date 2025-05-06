import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useMonthYearPeriodStore } from '@/store';
import { format } from 'date-fns';

interface SalesPeriodResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: {
    period: string;
    totalInvoice: number;
    months: Record<string, number>;
  }[];
}

interface UseMonthlySalesInvoiceParams {
  context: 'salesInvoice' | 'salesPersonInvoice';
  startPeriod?: string; // Tambahkan parameter opsional
  endPeriod?: string; // Tambahkan parameter opsional
}

const useMonthlySalesInvoice = ({
  context,
  startPeriod,
  endPeriod,
}: UseMonthlySalesInvoiceParams) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'dsb';
  const subModule_id = 'sls';

  const { salesInvoicePeriod, salesPersonInvoicePeriod } =
    useMonthYearPeriodStore();
  const storePeriod =
    context === 'salesInvoice' ? salesInvoicePeriod : salesPersonInvoicePeriod;

  // Gunakan parameter startPeriod dan endPeriod jika tersedia, jika tidak gunakan dari store
  const effectiveStartPeriod = startPeriod
    ? new Date(startPeriod)
    : storePeriod.startPeriod;
  const effectiveEndPeriod = endPeriod
    ? new Date(endPeriod)
    : storePeriod.endPeriod;

  const isValidRequest = Boolean(
    company_id &&
      module_id &&
      subModule_id &&
      effectiveStartPeriod &&
      effectiveEndPeriod
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesPeriodResponse,
    Error
  >({
    queryKey: [
      'salesPeriodComparison',
      context,
      company_id,
      module_id,
      subModule_id,
      effectiveStartPeriod,
      effectiveEndPeriod,
    ],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-analytics/getMonthlySalesInvoice`;

      const response = await api.get<SalesPeriodResponse>(url, {
        params: {
          startPeriod: format(effectiveStartPeriod!, 'MMMyyyy'),
          endPeriod: format(effectiveEndPeriod!, 'MMMyyyy'),
        },
      });

      return response.data;
    },
    enabled: isValidRequest,
    staleTime: 60 * 1000,
    retry: 2,
  });

  return {
    data: data?.data ?? [],
    isLoading,
    isFetching,
    error,
    ...rest,
  };
};

export default useMonthlySalesInvoice;

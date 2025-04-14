import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';

interface InvoiceStatus {
  id: string;
  name: string;
  count: number; // ✅ Ubah ke number agar mudah diproses
}

interface InvoiceStatusResponse {
  data: InvoiceStatus[];
}

export const useSalesInvoiceHdStatus = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);
  const invoiceType = useSalesInvoiceHdFilterStore(
    (state: { invoiceType: string[] }) => state.invoiceType
  );

  const isEnabled = !!company_id && !!module_id;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    InvoiceStatusResponse,
    Error
  >({
    queryKey: ['invoiceStatus', company_id, module_id, invoiceType],
    queryFn: async () => {
      // ✅ Seragam dengan `useinvoiceType`, gunakan query string
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd/statuses${
        invoiceType
          ? `?invoiceType=${encodeURIComponent(invoiceType.join(','))}`
          : ''
      }`;

      const response = await api.get<InvoiceStatusResponse>(url);
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
    ...rest,
  };
};

export default useSalesInvoiceHdStatus;

import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';

interface SalesInvoiceHdType {
  id: string;
  name: string;
  count: number; // ✅ Ubah ke number agar mudah diproses
}

interface SalesInvoiceTypeHdResponse {
  data: SalesInvoiceHdType[];
}

export const useSalesInvoiceHdType = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);
  const status = useSalesInvoiceHdFilterStore((state) => state.status);

  const isEnabled = !!company_id && !!module_id;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceTypeHdResponse,
    Error
  >({
    queryKey: ['invoiceType', company_id, module_id, status],
    queryFn: async () => {
      // ✅ Seragam dengan `useinvoiceType`, gunakan query string
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd/invoiceType${
        status ? `?status=${encodeURIComponent(status.join(','))}` : ''
      }`;

      const response = await api.get<SalesInvoiceTypeHdResponse>(url);
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

export default useSalesInvoiceHdType;

import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';
import { log } from 'console';

interface SalesInvoiceHdSalesPerson {
  id: string;
  name: string;
  count: number; // ✅ Ubah ke number agar mudah diproses
}

interface SalesInvoiceHdSalesPersonResponse {
  data: SalesInvoiceHdSalesPerson[];
}

export const useSalesInvoiceHdSalesPerson = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);
  const salesPersonName = useSalesInvoiceHdFilterStore(
    (state: { salesPersonName: string[] }) => state.salesPersonName
  );

  const isEnabled = !!company_id && !!module_id;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdSalesPersonResponse,
    Error
  >({
    queryKey: ['salesPersonName', company_id, module_id, salesPersonName],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd/salesPersonName${
        salesPersonName
          ? `?salesPersonName=${encodeURIComponent(salesPersonName.join(','))}`
          : ''
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
    ...rest,
  };
};

export default useSalesInvoiceHdSalesPerson;

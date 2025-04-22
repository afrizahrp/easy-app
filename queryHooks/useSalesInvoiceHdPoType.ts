import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';

interface SalesInvoiceHdPOType {
  id: string;
  name: string;
  count: number; // ✅ Ubah ke number agar mudah diproses
}

interface SalesInvoiceHdPoTypeResponse {
  data: SalesInvoiceHdPOType[];
}

export const useSalesInvoiceHdPoType = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id.toLocaleUpperCase(); // Pastikan company_id dalam huruf besar
  const module_id = useModuleStore((state) => state.moduleId);
  // const module_id = 'SLS'; // Hardcode module_id untuk Sales Invoice
  // const invoiceType = useSalesInvoiceHdFilterStore(
  //   (state: { invoiceType: string[] }) => state.invoiceType
  // );

  const { salesPersonName } = useSalesInvoiceHdFilterStore((state) => ({
    salesPersonName: state.salesPersonName,
    // status: state.status, // Ambil status (paidStatus) dari store
  }));

  const isEnabled = !!company_id && !!module_id && salesPersonName.length <= 1; // ✅ Update isEnabled logic

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdPoTypeResponse,
    Error
  >({
    queryKey: ['SalesInvoiceHdPoType', company_id, module_id, salesPersonName],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (salesPersonName?.length) {
        params.append('salesPersonName', salesPersonName.join(','));
      }

      // ✅ Seragam dengan `useinvoiceType`, gunakan query string
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd/invoicePoTypeName${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      const response = await api.get<SalesInvoiceHdPoTypeResponse>(url);
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

export default useSalesInvoiceHdPoType;

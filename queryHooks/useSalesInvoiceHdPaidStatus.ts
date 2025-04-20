import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';

interface SalesInvoiceHdStatus {
  id: string;
  name: string;
  count: number; // ✅ Ubah ke number agar mudah diproses
}

interface SalesInvoiceHdStatusResponse {
  data: SalesInvoiceHdStatus[];
}

export const useSalesInvoiceHdPaidStatus = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id.toLocaleUpperCase(); // Pastikan company_id dalam huruf besar
  // const module_id = useModuleStore((state) => state.moduleId);
  const module_id = 'SLS'; // Hardcode module_id untuk Sales Invoice
  // const invoiceType = useSalesInvoiceHdFilterStore(
  //   (state: { invoiceType: string[] }) => state.invoiceType
  // );

  const { salesPersonName } = useSalesInvoiceHdFilterStore((state) => ({
    salesPersonName: state.salesPersonName,
    // status: state.status, // Ambil status (paidStatus) dari store
  }));

  const isEnabled = !!company_id && !!module_id && salesPersonName.length <= 1; // ✅ Update isEnabled logic

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdStatusResponse,
    Error
  >({
    queryKey: ['salesInvoiceHdStatus', company_id, module_id, salesPersonName],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (salesPersonName?.length) {
        params.append('salesPersonName', salesPersonName.join(','));
      }

      // ✅ Seragam dengan `useinvoiceType`, gunakan query string
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd/statuses${
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
    ...rest,
  };
};

export default useSalesInvoiceHdPaidStatus;

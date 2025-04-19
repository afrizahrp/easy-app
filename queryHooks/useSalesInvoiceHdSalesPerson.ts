import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';

interface SalesInvoiceHdSalesPerson {
  id: string;
  name: string;
  count: number;
}

interface SalesInvoiceHdSalesPersonResponse {
  data: SalesInvoiceHdSalesPerson[];
}

export const useSalesInvoiceHdSalesPerson = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id.toLocaleUpperCase(); // Pastikan company_id dalam huruf besar
  // const module_id = useModuleStore((state) => state.moduleId);
  const module_id = 'SLS'; // Hardcode module_id untuk Sales Invoice
  const { salesPersonName, status } = useSalesInvoiceHdFilterStore((state) => ({
    salesPersonName: state.salesPersonName,
    status: state.status, // Ambil status (paidStatus) dari store
  }));

  const isEnabled = !!company_id && !!module_id;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdSalesPersonResponse,
    Error
  >({
    queryKey: [
      'salesPersonName',
      company_id,
      module_id,
      salesPersonName,
      status,
    ], // Tambahkan status ke queryKey
    queryFn: async () => {
      // Bangun URL dengan parameter salesPersonName dan paidStatus
      const params = new URLSearchParams();
      if (salesPersonName?.length) {
        params.append('salesPersonName', salesPersonName.join(','));
      }
      if (status?.length) {
        params.append('paidStatus', status.join(',')); // Tambahkan paidStatus ke query
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd/salesPersonName${
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
    ...rest,
  };
};

export default useSalesInvoiceHdSalesPerson;

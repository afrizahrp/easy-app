import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';
import { format } from 'date-fns';

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
  // const module_id = useModuleStore((state) => state.moduleId);
  const module_id = 'SLS';

  const { salesPersonName, startPeriod, endPeriod, paidStatus } =
    useSalesInvoiceHdFilterStore((state) => ({
      salesPersonName: state.salesPersonName,
      startPeriod: state.startPeriod,
      endPeriod: state.endPeriod,
      paidStatus: state.paidStatus,
    }));

  const isEnabled = !!company_id && !!module_id && salesPersonName.length <= 1; // ✅ Update isEnabled logic

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdPoTypeResponse,
    Error
  >({
    queryKey: [
      'SalesInvoiceHdPoType',
      company_id,
      module_id,
      startPeriod,
      endPeriod,
      paidStatus,
      salesPersonName,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Hanya jika ada salesPersonName, tambahkan ke query string
      if (salesPersonName?.length) {
        salesPersonName.forEach((name) => {
          params.append('salesPersonName', name); // ⬅️ jadi salesPersonName=HANDOYO&salesPersonName=RISA
        });
      }

      if (paidStatus?.length) {
        paidStatus.forEach((name: string) => {
          params.append('paidStatus', name); // ⬅️ jadi salesPersonName=HANDOYO&salesPersonName=RISA
        });
      }

      // if (status?.length) {
      //   params.append('paidStatus', status.join(','));
      // }

      // Jika ada startPeriod, tambahkan ke query string dengan format yang sesuai
      if (startPeriod) {
        params.append('startPeriod', format(startPeriod, 'MMMyyyy')); // Konversi Date ke string dalam format MMMyyyy
      }

      if (endPeriod) {
        params.append('endPeriod', format(endPeriod, 'MMMyyyy')); // Konversi Date ke string dalam format MMMyyyy
      }

      // ✅ Seragam dengan `useinvoiceType`, gunakan query string
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd/getPoType${
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

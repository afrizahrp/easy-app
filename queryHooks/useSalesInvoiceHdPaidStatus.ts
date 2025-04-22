import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';
import { format } from 'date-fns';

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
  const company_id = user?.company_id.toLocaleUpperCase();
  const module_id = useModuleStore((state) => state.moduleId);

  // Ambil filter dari store
  const { startPeriod, endPeriod, poType, salesPersonName } =
    useSalesInvoiceHdFilterStore((state) => ({
      startPeriod: state.startPeriod,
      endPeriod: state.endPeriod,
      poType: state.poType,
      salesPersonName: state.salesPersonName,
    }));

  // Pastikan enabled hanya true jika semua kondisi valid
  const isEnabled = !!company_id && !!module_id && salesPersonName.length <= 1;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdStatusResponse,
    Error
  >({
    queryKey: [
      'salesInvoiceHdStatus',
      company_id,
      module_id,
      startPeriod,
      endPeriod,
      poType,
      salesPersonName,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Jika ada startPeriod, tambahkan ke query string dengan format yang sesuai
      if (startPeriod) {
        params.append('startPeriod', format(startPeriod, 'MMMyyyy')); // Konversi Date ke string dalam format MMMyyyy
      }

      if (endPeriod) {
        params.append('endPeriod', format(endPeriod, 'MMMyyyy')); // Konversi Date ke string dalam format MMMyyyy
      }

      if (poType?.length) {
        poType.forEach((name) => {
          params.append('poType', name); // ⬅️ jadi salesPersonName=HANDOYO&salesPersonName=RISA
        });
      }

      // Hanya jika ada salesPersonName, tambahkan ke query string
      if (salesPersonName?.length) {
        salesPersonName.forEach((name) => {
          params.append('salesPersonName', name); // ⬅️ jadi salesPersonName=HANDOYO&salesPersonName=RISA
        });
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd/getPaidStatus${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      console.log('filtered params:', params.toString());

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

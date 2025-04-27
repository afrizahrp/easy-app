import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useMonthYearPeriodStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';
import { format } from 'date-fns';

interface SalesInvoiceHdSalesPerson {
  id: string;
  name: string;
  count: number;
}

interface SalesInvoiceHdSalesPersonResponse {
  data: SalesInvoiceHdSalesPerson[];
}

export const useSalesPersonChart = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id.toLocaleUpperCase(); // Pastikan company_id dalam huruf besar
  // const module_id = useModuleStore((state) => state.moduleId);
  const module_id = 'SLS'; // Ganti dengan ID modul yang sesuai

  const { startPeriod, endPeriod } = useMonthYearPeriodStore();

  const { salesPersonName, paidStatus, poType } = useSalesInvoiceHdFilterStore(
    (state) => ({
      salesPersonName: state.salesPersonName,
      poType: state.poType,

      paidStatus: state.paidStatus,
    })
  );

  const isEnabled = !!company_id && !!module_id;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdSalesPersonResponse,
    Error
  >({
    queryKey: ['salesPersonName', company_id, module_id, status, poType], // Tambahkan status ke queryKey
    queryFn: async () => {
      // Bangun URL dengan parameter salesPersonName dan paidStatus
      const params = new URLSearchParams();

      // Jika ada startPeriod, tambahkan ke query string dengan format yang sesuai
      if (startPeriod) {
        params.append('startPeriod', format(startPeriod, 'MMMyyyy')); // Konversi Date ke string dalam format MMMyyyy
      }

      if (endPeriod) {
        params.append('endPeriod', format(endPeriod, 'MMMyyyy')); // Konversi Date ke string dalam format MMMyyyy
      }

      // Hanya jika ada salesPersonName, tambahkan ke query string
      let url = '';
      if (salesPersonName?.length) {
        salesPersonName.forEach((name) => {
          params.append('salesPersonName', name); // ⬅️ jadi salesPersonName=HANDOYO&salesPersonName=RISA
        });

        url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-dashboard/getBySalesPersonByPeriod${
          params.toString() ? `?${params.toString()}` : ''
        }`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-dashboard/getByTopNSalesPersonByPeriod`;
      }

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

export default useSalesPersonChart;

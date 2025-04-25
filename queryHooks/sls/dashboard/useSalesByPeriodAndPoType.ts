import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useMonthYearPeriodStore } from '@/store';
import { format } from 'date-fns';

interface SalesByPoTypeResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: {
    period: string;
    poTypes: Record<string, number>;
  }[];
}

const useSalesByPeriodAndPoType = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'dsb';
  const subModule_id = 'sls';

  const { startPeriod, endPeriod } = useMonthYearPeriodStore();

  // Validasi semua parameter yang diperlukan
  const isValidRequest = Boolean(
    company_id && module_id && subModule_id && startPeriod && endPeriod
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesByPoTypeResponse,
    Error
  >({
    queryKey: [
      'salesByPeriodAndPoType',
      company_id,
      module_id,
      subModule_id,
      startPeriod,
      endPeriod,
    ],
    queryFn: async () => {
      // Buat URL untuk endpoint sls_periodPoType
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-dashboard/sls_periodPoType`;

      // Format periode untuk query parameter (misal: Jan2024 dan Jan2025)
      const startPeriodFormatted = format(startPeriod!, 'MMMyyyy');
      const endPeriodFormatted = format(endPeriod!, 'MMMyyyy');

      const response = await api.get<SalesByPoTypeResponse>(url, {
        params: {
          startPeriod: startPeriodFormatted,
          endPeriod: endPeriodFormatted,
        },
      });

      console.log('response data', response.data);

      return response.data;
    },
    enabled: isValidRequest,
    staleTime: 60 * 1000, // Cache selama 1 menit
    retry: 2, // Retry 2 kali jika gagal
  });

  return {
    data: data?.data ?? [],
    isLoading,
    isFetching,
    error,
    ...rest,
  };
};

export default useSalesByPeriodAndPoType;

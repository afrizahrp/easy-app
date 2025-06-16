import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useYearlyPeriodStore,
  useMonthlyPeriodStore,
} from '@/store';
import { getDefaultYears } from '@/lib/utils';
import axios from 'axios';

interface SalesPerson {
  salesPersonName: string;
  amount: number;
  quantity: number;
  growthPercentage: number;
}

interface SalesData {
  period: string;
  totalInvoice: number;
  sales: SalesPerson[];
}

interface SalesPeriodResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: SalesData[];
}

interface UseYearlySalesPersonInvoiceProps {
  context?: 'salesPersonInvoice'; // Opsional, untuk fleksibilitas
}

const useYearlySalesPersonInvoice = ({
  context,
  company_id,
  module_id = 'dsb',
  subModule_id = 'sls',
}: UseYearlySalesPersonInvoiceProps & {
  company_id?: string;
  module_id?: string;
  subModule_id?: string;
} = {}) => {
  const user = useSessionStore((state) => state.user);
  const resolvedCompanyId = company_id || user?.company_id?.toUpperCase();
  const { selectedYears } = useYearlyPeriodStore();
  const { selectedMonths } = useMonthlyPeriodStore();

  // Gunakan selectedYears jika ada, fallback ke getDefaultYears
  const years = selectedYears.length > 0 ? selectedYears : getDefaultYears();
  // Gunakan selectedMonths jika ada, kosongkan jika tidak ada
  const months = selectedMonths.length > 0 ? selectedMonths : [];

  const isValidRequest = Boolean(
    resolvedCompanyId && module_id && subModule_id && years.length > 0
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesPeriodResponse,
    Error
  >({
    queryKey: [
      'yearlySalesPersonInvoice',
      resolvedCompanyId,
      module_id,
      subModule_id,
      years,
      months, // Tambahkan months ke queryKey
    ],
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${resolvedCompanyId}/${module_id}/${subModule_id}/get-dashboard/getYearlySalespersonInvoice`;

      try {
        const response = await api.get<SalesPeriodResponse>(url, {
          params: { years, months }, // Kirim years dan months
          paramsSerializer: (params) => {
            const yearParams = params.years
              ? params.years
                  .map((year: string) => `years=${encodeURIComponent(year)}`)
                  .join('&')
              : '';
            const monthParams = params.months
              ? params.months
                  .map((month: string) => `months=${encodeURIComponent(month)}`)
                  .join('&')
              : '';
            return [yearParams, monthParams].filter(Boolean).join('&');
          },
        });

        console.log('Sales Person Invoice Response:', response.data);

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios Error:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            url,
            params: { years, months },
          });
          throw new Error(
            error.response?.data?.message ||
              'Failed to fetch yearly salesperson invoice data'
          );
        }
        console.error('Unexpected Error:', error);
        throw error;
      }
    },
    enabled: isValidRequest,
    staleTime: 5 * 60 * 1000, // 5 menit
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return false;
      }
      return failureCount < 3; // Konsisten dengan useYearlySalesInvoice
    },
  });

  return {
    data: data?.data ?? [],
    isLoading,
    isFetching,
    error,
    ...rest,
  };
};

export default useYearlySalesPersonInvoice;

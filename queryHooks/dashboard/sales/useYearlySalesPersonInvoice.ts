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
  company_id: string[];
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
  company_id: string[];
  module_id: string;
  subModule_id: string;
  data: SalesData[];
}

interface UseYearlySalesPersonInvoiceProps {
  context?: 'salesPersonInvoice';
}

const useYearlySalesPersonInvoice = ({
  context,
  company_id,
  module_id = 'dsb',
  subModule_id = 'sls',
}: UseYearlySalesPersonInvoiceProps & {
  company_id?: string | string[];
  module_id?: string;
  subModule_id?: string;
} = {}) => {
  const user = useSessionStore((state) => state.user);
  const { selectedYears } = useYearlyPeriodStore();
  const { selectedMonths } = useMonthlyPeriodStore();

  // Tentukan resolvedCompanyId sebagai array
  const resolvedCompanyId = Array.isArray(company_id)
    ? company_id.map((id) => id.toUpperCase())
    : company_id
      ? [company_id.toUpperCase()]
      : user?.company_id
        ? [user.company_id.toUpperCase()]
        : ['BIS']; // Fallback ke BIS jika tidak ada company_id

  // Pastikan years adalah string[]
  const years = (
    selectedYears.length > 0 ? selectedYears : getDefaultYears()
  ).map(String);
  // Gunakan selectedMonths jika ada, kosongkan jika tidak ada
  const months = selectedMonths.length > 0 ? selectedMonths : [];

  // Log untuk debugging
  console.log('Resolved Company IDs:', resolvedCompanyId);
  console.log('Years before request:', years);
  console.log('Months before request:', months);

  const isValidRequest = Boolean(
    resolvedCompanyId.length > 0 &&
      module_id &&
      subModule_id &&
      years.length > 0
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
      months,
    ],
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${module_id}/${subModule_id}/get-dashboard/getYearlySalespersonInvoice`;
      console.log('Request URL:', url);

      try {
        const response = await api.get<SalesPeriodResponse>(url, {
          params: { company_id: resolvedCompanyId, years, months },
          paramsSerializer: (params) => {
            const companyIdParams = params.company_id
              ? params.company_id
                  .map((id: string) => `company_id=${encodeURIComponent(id)}`)
                  .join('&')
              : '';
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
            const queryString = [companyIdParams, yearParams, monthParams]
              .filter(Boolean)
              .join('&');
            console.log('Serialized query string:', queryString);
            return queryString;
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
            params: { company_id: resolvedCompanyId, years, months },
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
      return failureCount < 3;
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

import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useCompanyFilterStore,
  useYearlyPeriodStore,
  useMonthlyPeriodStore,
} from '@/store';
import { getDefaultYears } from '@/lib/utils';
import { getShortMonth } from '@/utils/getShortmonths'; // Import the utility function
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
  module_id = 'dsb',
  subModule_id = 'sls',
}: UseYearlySalesPersonInvoiceProps & {
  module_id?: string;
  subModule_id?: string;
} = {}) => {
  const { selectedYears } = useYearlyPeriodStore();
  const { selectedMonths } = useMonthlyPeriodStore();

  // Gunakan useCompanyFilterStore untuk mendapatkan selectedCompanyIds dengan cara reactive
  const { selectedCompanyIds } = useCompanyFilterStore();
  const resolvedCompanyId =
    selectedCompanyIds.length > 0 ? selectedCompanyIds : ['BIS'];

  // Gunakan selectedYears jika ada, fallback ke getDefaultYears jika kosong
  const years = selectedYears.length > 0 ? selectedYears : getDefaultYears();
  // Gunakan selectedMonths jika ada, kosongkan jika tidak ada

  const shortMonths = selectedMonths.map(getShortMonth);

  const months = shortMonths.length > 0 ? shortMonths : [];

  const isValidRequest = Boolean(
    resolvedCompanyId &&
      module_id &&
      subModule_id &&
      (years.length > 0 || months.length > 0)
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

      try {
        const response = await api.get<SalesPeriodResponse>(url, {
          params: { company_id: resolvedCompanyId, years, months },
          paramsSerializer: (params) => {
            // Serialize company_id, years, dan months ke query parameters
            const companyIdParams = Array.isArray(params.company_id)
              ? params.company_id
                  .map((id: string) => `company_id=${encodeURIComponent(id)}`)
                  .join('&')
              : `company_id=${encodeURIComponent(params.company_id)}`;

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
            return [companyIdParams, yearParams, monthParams]
              .filter(Boolean)
              .join('&');
          },
        });

        return {
          ...response.data,
          data: response.data.data,
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message ||
              'Failed to fetch yearly salesperson invoice data'
          );
        }
        throw error;
      }
    },
    enabled: isValidRequest,
    staleTime: 5 * 60 * 1000, // 5 menit
    retry: 3,
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

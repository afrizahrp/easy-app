import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useYearlyPeriodStore, useMonthlyPeriodStore } from '@/store';
import { useCompanyFilterStore } from '@/store/companyFilter.store';

import { getDefaultYears } from '@/lib/utils';
import { getShortMonth } from '@/utils/getShortmonths'; // Import the utility function
import axios from 'axios';

interface YearlySalesInvoiceResponse {
  company_id: string[];
  module_id: string;
  subModule_id: string;
  data: {
    period: string;
    totalInvoice: number;
    quantity: number;
    growthPercentage: number;

    // sales: {
    //   amount: number;
    //   quantity: number;
    //   growthPercentage: number;
    // }[];
  }[];
}

const useYearlySalesInvoice = (
  module_id: string = 'dsb',
  subModule_id: string = 'sls'
) => {
  const { selectedYears } = useYearlyPeriodStore();
  const { selectedMonths } = useMonthlyPeriodStore();

  // Contoh penggunaan:
  const shortMonths = selectedMonths.map(getShortMonth);

  // Ambil semua company_id yang dipilih dari store
  const selectedCompanyIds = useCompanyFilterStore(
    (state) => state.selectedCompanyIds
  );
  // Gunakan semua company_id yang dipilih, fallback ke BIS jika kosong
  const resolvedCompanyIds =
    selectedCompanyIds.length > 0 ? selectedCompanyIds : ['BIS'];

  console.log('resolvedCompanyIds', resolvedCompanyIds);

  // Gunakan selectedYears jika ada, fallback ke getDefaultYears jika kosong
  const years = selectedYears.length > 0 ? selectedYears : getDefaultYears();
  // Gunakan selectedMonths jika ada, kosongkan jika tidak ada
  // const months = selectedMonths.length > 0 ? selectedMonths : [];

  const months = shortMonths.length > 0 ? shortMonths : [];

  const isValidRequest = Boolean(
    // Ambil company_id dari useCompanyFilterStore
    resolvedCompanyIds.length > 0 &&
      module_id &&
      subModule_id &&
      (years.length > 0 || months.length > 0)
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    YearlySalesInvoiceResponse,
    Error
  >({
    queryKey: [
      'yearlySalesInvoice',
      resolvedCompanyIds,
      module_id,
      subModule_id,
      years,
      months,
    ],
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${module_id}/${subModule_id}/get-dashboard/getYearlySalesInvoice`;
      try {
        const response = await api.get<YearlySalesInvoiceResponse>(url, {
          params: { company_id: resolvedCompanyIds, years, months },
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
              'Failed to fetch yearly sales invoice data'
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

export default useYearlySalesInvoice;

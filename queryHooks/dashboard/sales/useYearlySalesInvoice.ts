// src/hooks/useYearlySalesInvoice.ts
import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useYearlyPeriodStore } from '@/store';
import { getDefaultYears } from '@/utils';
import axios from 'axios';

interface YearlySalesInvoiceResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: {
    period: string;
    totalInvoice: number;
    quantity: number;
    growthPercentage: number | null; // Izinkan null
  }[];
}

interface QueryParams {
  years: string[];
}

const useYearlySalesInvoice = (
  company_id?: string,
  module_id: string = 'dashboard',
  subModule_id: string = 'sls'
) => {
  const user = useSessionStore((state) => state.user);
  const resolvedCompanyId = company_id || user?.company_id?.toUpperCase();

  const { yearsByModule } = useYearlyPeriodStore();
  const years = yearsByModule.salesInvoice || getDefaultYears();

  const isValidRequest = Boolean(
    resolvedCompanyId && module_id && subModule_id && years && years.length > 0
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    YearlySalesInvoiceResponse,
    Error
  >({
    queryKey: [
      'yearlySalesInvoice',
      resolvedCompanyId,
      module_id,
      subModule_id,
      years,
    ],
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${resolvedCompanyId}/${module_id}/${subModule_id}/yearly/sales-invoice`;
      try {
        const response = await api.get<YearlySalesInvoiceResponse>(url, {
          params: { years: years.join(',') },
        });
        return response.data;
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

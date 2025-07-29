import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useCompanyFilterStore, useMonthlyPeriodStore } from '@/store';
import { getShortMonth } from '@/utils/getShortmonths';
import axios from 'axios';
import { useMemo } from 'react';

interface MonthlyData {
  amount: number;
  growthPercentage: number | null;
}

interface SalesInvoiceComparisonData {
  period: string;
  totalInvoice: number;
  months: { [month: string]: MonthlyData };
}

interface SalesPeriodResponse {
  company_id: string[];
  module_id: string;
  subModule_id: string;
  data: SalesInvoiceComparisonData[];
}

interface UseMonthlyComparisonSalesInvoiceParams {
  context: 'salesInvoice' | 'salesPersonInvoice';
}

const useMonthlyComparisonSalesInvoice = ({
  context,
}: UseMonthlyComparisonSalesInvoiceParams) => {
  const { selectedCompanyIds } = useCompanyFilterStore();
  const { selectedMonths } = useMonthlyPeriodStore();

  const module_id = 'ANT';
  const subModule_id = 'sls';

  // Memoize resolvedCompanyId and months for stability
  const resolvedCompanyId = useMemo(
    () => (selectedCompanyIds.length > 0 ? selectedCompanyIds : ['BIS']),
    [selectedCompanyIds]
  );

  const months = useMemo(
    () => (selectedMonths?.length > 0 ? selectedMonths.map(getShortMonth) : []),
    [selectedMonths]
  );

  // Validate request parameters
  const isValidRequest = Boolean(
    resolvedCompanyId && module_id && subModule_id && months.length > 0
  );

  console.log(
    '[useMonthlyComparisonSalesInvoice] isValidRequest:',
    isValidRequest
  );
  console.log('[useMonthlyComparisonSalesInvoice] queryKey:', [
    'monthlyComparisonSalesInvoice',
    context,
    resolvedCompanyId,
    module_id,
    subModule_id,
    months,
  ]);

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesPeriodResponse,
    Error
  >({
    queryKey: [
      'monthlyComparisonSalesInvoice',
      context,
      resolvedCompanyId,
      module_id,
      subModule_id,
      months,
    ],
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }

      console.log('resolvedCompanyId:', resolvedCompanyId);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${module_id}/${subModule_id}/get-analytics/getMonthlyComparisonSalesInvoice`;

      try {
        const response = await api.get<SalesPeriodResponse>(url, {
          params: { company_id: resolvedCompanyId, months },
          paramsSerializer: (params) => {
            const companyIdParams = Array.isArray(params.company_id)
              ? params.company_id
                  .map((id: string) => `company_id=${encodeURIComponent(id)}`)
                  .join('&')
              : `company_id=${encodeURIComponent(params.company_id)}`;

            const monthParams = params.months
              ? params.months
                  .map((month: string) => `months=${encodeURIComponent(month)}`)
                  .join('&')
              : '';

            return [companyIdParams, monthParams].filter(Boolean).join('&');
          },
        });

        console.log(
          `[useMonthlyComparisonSalesInvoice:${context}] response:`,
          response.data
        );

        return {
          ...response.data,
          data: response.data.data,
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message ||
              'Failed to fetch monthly comparison sales invoice data'
          );
        }
        throw error;
      }
    },
    enabled: isValidRequest,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

export default useMonthlyComparisonSalesInvoice;

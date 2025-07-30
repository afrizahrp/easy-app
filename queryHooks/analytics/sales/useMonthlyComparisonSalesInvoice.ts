import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useCompanyFilterStore,
  useMonthYearPeriodStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';
import axios from 'axios';
import { useMemo } from 'react';
import { format } from 'date-fns';

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
  module_id?: string;
  subModule_id?: string;
}

// Add axios interceptor for debugging (optional)
if (process.env.NODE_ENV === 'development') {
  api.interceptors.request.use(
    (config) => {
      console.log('🚀 [AXIOS DEBUG] Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data,
      });
      return config;
    },
    (error) => {
      console.error('❌ [AXIOS DEBUG] Request Error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('✅ [AXIOS DEBUG] Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error('❌ [AXIOS DEBUG] Response Error:', {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
      });
      return Promise.reject(error);
    }
  );
}

const useMonthlyComparisonSalesInvoice = ({
  context,
  module_id = 'ANT',
  subModule_id = 'sls',
}: UseMonthlyComparisonSalesInvoiceParams) => {
  const { selectedCompanyIds } = useCompanyFilterStore();
  const { salesInvoicePeriod, salesPersonInvoicePeriod } =
    useMonthYearPeriodStore();
  const { salesInvoiceFilters, salesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore();

  // Get filters based on context
  const filters = useMemo(() => {
    return context === 'salesInvoice'
      ? salesInvoiceFilters
      : salesPersonInvoiceFilters;
  }, [context, salesInvoiceFilters, salesPersonInvoiceFilters]);

  const { salesPersonName, paidStatus, poType } = filters;

  // Memoize resolvedCompanyId untuk stabilitas
  const resolvedCompanyId = useMemo(
    () => (selectedCompanyIds.length > 0 ? selectedCompanyIds : ['BIS']),
    [selectedCompanyIds]
  );

  // Get period based on context
  const period = useMemo(() => {
    return context === 'salesInvoice'
      ? salesInvoicePeriod
      : salesPersonInvoicePeriod;
  }, [context, salesInvoicePeriod, salesPersonInvoicePeriod]);

  // Format startPeriod and endPeriod as MMMYYYY
  const { startPeriod, endPeriod } = useMemo(() => {
    const formatPeriod = (date: Date | null): string | null => {
      if (!date) return null;
      return format(date, 'MMMyyyy');
    };

    return {
      startPeriod: formatPeriod(period.startPeriod),
      endPeriod: formatPeriod(period.endPeriod),
    };
  }, [period.startPeriod, period.endPeriod]);

  // Validate request parameters
  const isValidRequest = useMemo(
    () =>
      Boolean(
        resolvedCompanyId &&
          module_id &&
          subModule_id &&
          startPeriod &&
          endPeriod
      ),
    [resolvedCompanyId, module_id, subModule_id, startPeriod, endPeriod]
  );

  // Memoize query key untuk stabilitas
  const queryKey = useMemo(
    () => [
      'monthlyComparisonSalesInvoice',
      context,
      resolvedCompanyId,
      module_id,
      subModule_id,
      startPeriod,
      endPeriod,
      salesPersonName,
      paidStatus,
      poType,
    ],
    [
      context,
      resolvedCompanyId,
      module_id,
      subModule_id,
      startPeriod,
      endPeriod,
      salesPersonName,
      paidStatus,
      poType,
    ]
  );

  // console.log(
  //   '[useMonthlyComparisonSalesInvoice] isValidRequest:',
  //   isValidRequest
  // );
  // console.log('[useMonthlyComparisonSalesInvoice] queryKey:', queryKey);
  // console.log('[useMonthlyComparisonSalesInvoice] Period:', {
  //   startPeriod,
  //   endPeriod,
  //   context,
  // });

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesPeriodResponse,
    Error
  >({
    queryKey,
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${module_id}/${subModule_id}/get-analytics/getMonthlyComparisonSalesInvoice`;

      try {
        const response = await api.get<SalesPeriodResponse>(url, {
          params: {
            company_id: resolvedCompanyId,
            startPeriod,
            endPeriod,
            salesPersonName: salesPersonName?.length
              ? salesPersonName
              : undefined,
            paidStatus: paidStatus?.length ? paidStatus : undefined,
            poType: poType?.length ? poType : undefined,
          },
          paramsSerializer: (params) => {
            const companyIdParams = Array.isArray(params.company_id)
              ? params.company_id
                  .map((id: string) => `company_id=${encodeURIComponent(id)}`)
                  .join('&')
              : `company_id=${encodeURIComponent(params.company_id)}`;

            const startPeriodParam = params.startPeriod
              ? `startPeriod=${encodeURIComponent(params.startPeriod)}`
              : '';

            const endPeriodParam = params.endPeriod
              ? `endPeriod=${encodeURIComponent(params.endPeriod)}`
              : '';

            const salesPersonNameParams = Array.isArray(params.salesPersonName)
              ? params.salesPersonName
                  .map(
                    (name: string) =>
                      `salesPersonName=${encodeURIComponent(name)}`
                  )
                  .join('&')
              : params.salesPersonName
                ? `salesPersonName=${encodeURIComponent(params.salesPersonName)}`
                : '';

            const paidStatusParams = Array.isArray(params.paidStatus)
              ? params.paidStatus
                  .map(
                    (status: string) =>
                      `paidStatus=${encodeURIComponent(status)}`
                  )
                  .join('&')
              : params.paidStatus
                ? `paidStatus=${encodeURIComponent(params.paidStatus)}`
                : '';

            const poTypeParams = Array.isArray(params.poType)
              ? params.poType
                  .map((type: string) => `poType=${encodeURIComponent(type)}`)
                  .join('&')
              : params.poType
                ? `poType=${encodeURIComponent(params.poType)}`
                : '';

            return [
              companyIdParams,
              startPeriodParam,
              endPeriodParam,
              salesPersonNameParams,
              paidStatusParams,
              poTypeParams,
            ]
              .filter(Boolean)
              .join('&');
          },
        });

        return {
          ...response.data,
          data: response.data.data,
        };
      } catch (error) {
        // Debug: Log error details
        console.error('❌ [DEBUG] Request failed:', {
          url,
          params: {
            company_id: resolvedCompanyId,
            startPeriod,
            endPeriod,
            salesPersonName,
            paidStatus,
            poType,
          },
          error: error instanceof Error ? error.message : error,
        });

        if (axios.isAxiosError(error)) {
          console.error('❌ [DEBUG] Axios error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: error.config,
          });

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

import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useSalesInvoiceHdFilterStore,
  useMonthYearPeriodStore,
  useCompanyFilterStore,
} from '@/store';
import { format } from 'date-fns';
import { AxiosError } from 'axios';
import axios from 'axios';
import { useMemo } from 'react';

interface SalesData {
  period: string;
  totalInvoice: number;
  months: {
    month: string;
    sales: {
      salesPersonName: string;
      amount: number;
      growthPercentage: number | null;
    }[];
  }[];
}

interface SalesPeriodResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: SalesData[];
}

interface UseMonthlyComparisonSalesPersonInvoiceProps {
  context: 'salesPersonInvoice';
  salesPersonNames?: string[];
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number | false;
}

const useMonthlyComparisonSalesPersonInvoice = ({
  context,
  salesPersonNames,
  refetchOnWindowFocus,
  refetchInterval,
}: UseMonthlyComparisonSalesPersonInvoiceProps) => {
  const user = useSessionStore((state) => state.user);
  const { selectedCompanyIds } = useCompanyFilterStore();
  const module_id = 'ANT';
  const subModule_id = 'sls';

  const { salesPersonInvoicePeriod } = useMonthYearPeriodStore();
  const { salesPersonInvoiceFilters } = useSalesInvoiceHdFilterStore();

  const { salesPersonName: storeSalesPersonName } = salesPersonInvoiceFilters;

  // Use selectedCompanyIds if available, otherwise fallback to user's company_id
  const resolvedCompanyId = useMemo(() => {
    if (selectedCompanyIds.length > 0) {
      return selectedCompanyIds;
    }
    return user?.company_id?.toUpperCase()
      ? [user.company_id.toUpperCase()]
      : ['BIS'];
  }, [selectedCompanyIds, user?.company_id]);

  // Format startPeriod and endPeriod as MMMYYYY
  const { startPeriod, endPeriod } = useMemo(() => {
    const formatPeriod = (date: Date | null): string | null => {
      if (!date) return null;
      return format(date, 'MMMyyyy');
    };

    return {
      startPeriod: formatPeriod(salesPersonInvoicePeriod.startPeriod),
      endPeriod: formatPeriod(salesPersonInvoicePeriod.endPeriod),
    };
  }, [
    salesPersonInvoicePeriod.startPeriod,
    salesPersonInvoicePeriod.endPeriod,
  ]);

  const isValidRequest = useMemo(
    () =>
      Boolean(
        resolvedCompanyId.length > 0 &&
          module_id &&
          subModule_id &&
          startPeriod &&
          endPeriod
      ),
    [resolvedCompanyId, module_id, subModule_id, startPeriod, endPeriod]
  );

  const validSalesPersonNames = useMemo(() => {
    if (salesPersonNames && salesPersonNames.length > 0) {
      return salesPersonNames.filter(
        (name) => typeof name === 'string' && name.trim()
      );
    }
    if (storeSalesPersonName && storeSalesPersonName.length > 0) {
      return storeSalesPersonName.filter(
        (name) => typeof name === 'string' && name.trim()
      );
    }
    return [];
  }, [salesPersonNames, storeSalesPersonName]);

  const queryKey = useMemo(
    () => [
      'monthlyComparisonSalesPersonInvoice',
      context,
      resolvedCompanyId,
      module_id,
      subModule_id,
      startPeriod,
      endPeriod,
      validSalesPersonNames,
    ],
    [
      context,
      resolvedCompanyId,
      module_id,
      subModule_id,
      startPeriod,
      endPeriod,
      validSalesPersonNames,
    ]
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesPeriodResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey,
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request parameters');
      }

      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${module_id}/${subModule_id}/get-analytics/getMonthlyComparisonSalesPersonInvoice`;

      try {
        const response = await api.get<SalesPeriodResponse>(url, {
          params: {
            company_id: resolvedCompanyId,
            startPeriod,
            endPeriod,
            salesPersonName:
              validSalesPersonNames.length > 0
                ? validSalesPersonNames
                : undefined,
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

            const finalParams = [
              companyIdParams,
              startPeriodParam,
              endPeriodParam,
              salesPersonNameParams,
            ]
              .filter(Boolean)
              .join('&');

            console.log('🔍 [HOOK DEBUG] Final URL params:', finalParams);
            console.log('🔍 [HOOK DEBUG] startPeriod:', params.startPeriod);
            console.log('🔍 [HOOK DEBUG] endPeriod:', params.endPeriod);

            return finalParams;
          },
        });

        console.log(
          `[useMonthlyComparisonSalesPersonInvoice:${context}] response.data:`,
          JSON.stringify(response.data, null, 2)
        );
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;

        // Debug: Log error details
        console.error('❌ [DEBUG] Request failed:', {
          url,
          params: {
            company_id: resolvedCompanyId,
            startPeriod,
            endPeriod,
            salesPersonName: validSalesPersonNames,
          },
          error: axiosError.message,
        });

        if (axios.isAxiosError(axiosError)) {
          console.error('❌ [DEBUG] Axios error details:', {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
            config: axiosError.config,
          });
        }

        throw new Error(
          axiosError.response?.data?.message || 'Failed to fetch sales data'
        );
      }
    },
    enabled: isValidRequest,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: refetchOnWindowFocus ?? false,
    refetchInterval: refetchInterval ?? false,
    retry: (failureCount, err) => {
      if (err instanceof AxiosError && err.response?.status === 400) {
        return false;
      }
      return failureCount < 2;
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

export default useMonthlyComparisonSalesPersonInvoice;

import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useCompanyFilterStore, useMonthYearPeriodStore } from '@/store';
import axios from 'axios';
import { useMemo } from 'react';
import { format } from 'date-fns';

interface PaidStatusData {
  id: string;
  name: string;
  count: number;
}

interface PaidStatusResponse {
  data: PaidStatusData[];
}

const usePaidStatusByCompany = () => {
  const { selectedCompanyIds } = useCompanyFilterStore();
  const { salesInvoicePeriod } = useMonthYearPeriodStore();

  const resolvedCompanyIds = useMemo(
    () => (selectedCompanyIds.length > 0 ? selectedCompanyIds : ['BIS']),
    [selectedCompanyIds]
  );

  const { startPeriod, endPeriod } = useMemo(() => {
    const formatPeriod = (date: Date | null): string | null => {
      if (!date) return null;
      return format(date, 'MMMyyyy');
    };
    return {
      startPeriod: formatPeriod(salesInvoicePeriod.startPeriod),
      endPeriod: formatPeriod(salesInvoicePeriod.endPeriod),
    };
  }, [salesInvoicePeriod.startPeriod, salesInvoicePeriod.endPeriod]);

  const isValidRequest = useMemo(
    () => Boolean(resolvedCompanyIds && startPeriod && endPeriod),
    [resolvedCompanyIds, startPeriod, endPeriod]
  );

  const queryKey = useMemo(
    () => ['paidStatusByCompany', resolvedCompanyIds, startPeriod, endPeriod],
    [resolvedCompanyIds, startPeriod, endPeriod]
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    PaidStatusResponse,
    Error
  >({
    queryKey,
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }
      const url = `${process.env.NEXT_PUBLIC_API_URL}/SLS/get-invoiceHd/getPaidStatus`;
      try {
        const response = await api.get<PaidStatusResponse>(url, {
          params: {
            company_id: resolvedCompanyIds,
            startPeriod,
            endPeriod,
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
            return [companyIdParams, startPeriodParam, endPeriodParam]
              .filter(Boolean)
              .join('&');
          },
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || 'Failed to fetch paid status data'
          );
        }
        throw error;
      }
    },
    enabled: isValidRequest,
    staleTime: 5 * 60 * 1000,
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

export default usePaidStatusByCompany;

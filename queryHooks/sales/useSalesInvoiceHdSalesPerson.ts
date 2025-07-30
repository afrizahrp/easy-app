import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useCompanyFilterStore,
  useMonthYearPeriodStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';
import { format } from 'date-fns';
import { useMemo } from 'react';
import axios from 'axios';

interface SalesInvoiceHdSalesPerson {
  id: string;
  name: string;
  count: number;
}

interface SalesInvoiceHdSalesPersonResponse {
  data: SalesInvoiceHdSalesPerson[];
}

interface UseSalesInvoiceHdSalesPersonParams {
  context: 'salesInvoice' | 'salesPersonInvoice';
}

export const useSalesInvoiceHdSalesPerson = ({
  context,
}: UseSalesInvoiceHdSalesPersonParams) => {
  const { selectedCompanyIds } = useCompanyFilterStore();
  const module_id = 'SLS';

  const { salesInvoicePeriod, salesPersonInvoicePeriod } =
    useMonthYearPeriodStore();
  const { salesInvoiceFilters, salesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore();

  const period =
    context === 'salesInvoice' ? salesInvoicePeriod : salesPersonInvoicePeriod;
  const filters =
    context === 'salesInvoice'
      ? salesInvoiceFilters
      : salesPersonInvoiceFilters;

  const { paidStatus, poType } = filters;

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
      startPeriod: formatPeriod(period.startPeriod),
      endPeriod: formatPeriod(period.endPeriod),
    };
  }, [period.startPeriod, period.endPeriod]);

  const isValidRequest = useMemo(
    () => Boolean(resolvedCompanyIds && startPeriod && endPeriod),
    [resolvedCompanyIds, startPeriod, endPeriod]
  );

  const queryKey = useMemo(
    () => [
      'salesPersonName',
      context,
      resolvedCompanyIds,
      module_id,
      startPeriod,
      endPeriod,
      paidStatus,
      poType,
    ],
    [
      context,
      resolvedCompanyIds,
      module_id,
      startPeriod,
      endPeriod,
      paidStatus,
      poType,
    ]
  );

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdSalesPersonResponse,
    Error
  >({
    queryKey,
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/SLS/get-invoiceHd/getSalesPerson`;

      try {
        const response = await api.get<SalesInvoiceHdSalesPersonResponse>(url, {
          params: {
            company_id: resolvedCompanyIds,
            startPeriod,
            endPeriod,
            poType: poType?.length ? poType : undefined,
            paidStatus: paidStatus?.length ? paidStatus : undefined,
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

            const poTypeParams = Array.isArray(params.poType)
              ? params.poType
                  .map((type: string) => `poType=${encodeURIComponent(type)}`)
                  .join('&')
              : params.poType
                ? `poType=${encodeURIComponent(params.poType)}`
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

            return [
              companyIdParams,
              startPeriodParam,
              endPeriodParam,
              poTypeParams,
              paidStatusParams,
            ]
              .filter(Boolean)
              .join('&');
          },
        });

        console.log(
          `[useSalesInvoiceHdSalesPerson:${context}] URL: ${url}, Response: ${JSON.stringify(response.data)}`
        );

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || 'Failed to fetch sales person data'
          );
        }
        throw error;
      }
    },
    enabled: isValidRequest,
    staleTime: 60 * 1000,
    retry: 3,
  });

  return {
    data: data?.data,
    isLoading,
    error,
    isFetching,
    ...rest,
  };
};

export default useSalesInvoiceHdSalesPerson;

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

interface SalesInvoiceHdPOType {
  id: string;
  name: string;
  count: number;
}

interface SalesInvoiceHdPoTypeResponse {
  data: SalesInvoiceHdPOType[];
}

interface UseSalesInvoiceHdPoTypeParams {
  context: 'salesInvoice';
}

export const useSalesInvoiceHdPoType = ({
  context,
}: UseSalesInvoiceHdPoTypeParams) => {
  const { selectedCompanyIds } = useCompanyFilterStore();
  const module_id = 'SLS';

  const { salesInvoicePeriod } = useMonthYearPeriodStore();
  const { salesInvoiceFilters } = useSalesInvoiceHdFilterStore();

  const { salesPersonName, paidStatus } = salesInvoiceFilters;

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
    () =>
      Boolean(
        resolvedCompanyIds &&
          startPeriod &&
          endPeriod &&
          salesPersonName &&
          paidStatus
      ),
    [resolvedCompanyIds, startPeriod, endPeriod, salesPersonName, paidStatus]
  );

  const queryKey = useMemo(
    () => [
      'SalesInvoiceHdPoType',
      context,
      module_id,
      startPeriod,
      endPeriod,
      paidStatus,
      salesPersonName,
      resolvedCompanyIds,
    ],
    [
      context,
      module_id,
      startPeriod,
      endPeriod,
      paidStatus,
      salesPersonName,
      resolvedCompanyIds,
    ]
  );

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdPoTypeResponse,
    Error
  >({
    queryKey,
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/SLS/get-invoiceHd/getPoType`;

      try {
        const response = await api.get<SalesInvoiceHdPoTypeResponse>(url, {
          params: {
            company_id: resolvedCompanyIds,
            startPeriod,
            endPeriod,
            salesPersonName: salesPersonName?.length
              ? salesPersonName
              : undefined,
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

            return [
              companyIdParams,
              startPeriodParam,
              endPeriodParam,
              salesPersonNameParams,
              paidStatusParams,
            ]
              .filter(Boolean)
              .join('&');
          },
        });

        console.log(
          `[useSalesInvoiceHdPoType:${context}] URL: ${url}, Response: ${JSON.stringify(response.data)}`
        );

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || 'Failed to fetch PO type data'
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

export default useSalesInvoiceHdPoType;

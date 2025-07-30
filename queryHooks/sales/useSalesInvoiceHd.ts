// src/hooks/useSalesInvoiceHd.ts
import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useCompanyFilterStore,
  useMonthYearPeriodStore,
  useSalesInvoiceHdFilterStore,
  useSearchParamsStore, // Tambahkan kembali
} from '@/store';
import { SalesInvoiceHd } from '@/types';
import { format } from 'date-fns';
import { SEARCH_CONTEXTS } from '@/constants/searchContexts';
import { useMemo } from 'react';
import axios from 'axios';

interface SalesInvoiceHdResponse {
  data: SalesInvoiceHd[];
  totalRecords: number;
  grandTotal_amount?: number;
}

interface Filters {
  paidStatus?: string[];
  poType?: string[];
  salesPersonName?: string[];
}

interface UseSalesInvoiceHdParams {
  page: number;
  limit: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  filters?: Filters;
  startPeriod?: Date | null;
  endPeriod?: Date | null;
  context: 'salesInvoice' | 'salesPersonInvoice';
}

const useSalesInvoiceHd = ({
  page,
  limit,
  orderBy,
  orderDir,
  filters = {},
  startPeriod = null,
  endPeriod = null,
  context,
}: UseSalesInvoiceHdParams) => {
  if (!SEARCH_CONTEXTS.includes(context)) {
    console.error(`Invalid context in useSalesInvoiceHd: ${context}`);
    throw new Error(`Invalid search context: ${context}`);
  }

  const { selectedCompanyIds } = useCompanyFilterStore();
  const module_id = 'SLS';

  const { salesInvoicePeriod, salesPersonInvoicePeriod } =
    useMonthYearPeriodStore();
  const { salesInvoiceFilters, salesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore();

  const { searchParams } = useSearchParamsStore();
  const contextSearchParams = searchParams[context] ?? {
    searchBy: 'invoice_id',
    searchTerm: '',
  };
  const { searchBy, searchTerm } = contextSearchParams;

  const resolvedCompanyIds = useMemo(
    () => (selectedCompanyIds.length > 0 ? selectedCompanyIds : ['BIS']),
    [selectedCompanyIds]
  );

  const period =
    context === 'salesInvoice' ? salesInvoicePeriod : salesPersonInvoicePeriod;
  const storeFilters =
    context === 'salesInvoice'
      ? salesInvoiceFilters
      : salesPersonInvoiceFilters;

  const isValidRequest = Boolean(resolvedCompanyIds && module_id);

  const buildFilteredParams = (
    base: Record<string, string | number | undefined>,
    extra: {
      startPeriod?: Date | null;
      endPeriod?: Date | null;
      paidStatus?: string[];
      poType?: string[];
      salesPersonName?: string[];
      searchBy?: string;
      searchTerm?: string;
    }
  ): Record<string, unknown> => {
    const result: Record<string, unknown> = Object.fromEntries(
      Object.entries(base).filter(([, value]) => {
        if (typeof value === 'string') return value.trim() !== '';
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined;
      })
    );

    if (extra.startPeriod) {
      result.startPeriod = format(extra.startPeriod, 'MMMyyyy');
    }

    if (extra.endPeriod) {
      result.endPeriod = format(extra.endPeriod, 'MMMyyyy');
    } else if (extra.startPeriod) {
      result.endPeriod = format(extra.startPeriod, 'MMMyyyy');
    }

    if (extra.paidStatus?.length) {
      result.paidStatus = extra.paidStatus;
    }

    if (extra.salesPersonName?.length) {
      result.salesPersonName = extra.salesPersonName;
    }

    if (extra.poType?.length) {
      result.poType = extra.poType;
    }

    if (extra.searchTerm && extra.searchBy) {
      result.searchBy = extra.searchBy;
      result.searchTerm = extra.searchTerm;
    } else if (extra.searchTerm || extra.searchBy) {
      console.warn('Incomplete search params:', {
        searchBy: extra.searchBy,
        searchTerm: extra.searchTerm,
      });
    }

    return result;
  };

  const mergedFilters: Filters = {
    paidStatus: filters.paidStatus ?? storeFilters.paidStatus,
    poType: filters.poType ?? storeFilters.poType,
    salesPersonName: filters.salesPersonName ?? storeFilters.salesPersonName,
  };

  const queryKey = useMemo(
    () => [
      'salesInvoiceHd',
      resolvedCompanyIds,
      module_id,
      page,
      limit,
      searchBy,
      searchTerm,
      orderBy,
      orderDir,
      mergedFilters,
      startPeriod || period.startPeriod,
      endPeriod || period.endPeriod,
    ],
    [
      resolvedCompanyIds,
      module_id,
      page,
      limit,
      searchBy,
      searchTerm,
      orderBy,
      orderDir,
      mergedFilters,
      startPeriod || period.startPeriod,
      endPeriod || period.endPeriod,
    ]
  );

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdResponse,
    Error
  >({
    queryKey,
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request: company_id or module_id missing');
      }

      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }

      const filteredParams = buildFilteredParams(
        { page, limit, orderBy, orderDir },
        {
          paidStatus: mergedFilters.paidStatus,
          salesPersonName: mergedFilters.salesPersonName,
          poType: mergedFilters.poType,
          startPeriod: startPeriod || period.startPeriod,
          endPeriod: endPeriod || period.endPeriod,
          searchBy,
          searchTerm,
        }
      );

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${module_id}/get-invoiceHd`;

      try {
        const response = await api.get<SalesInvoiceHdResponse>(url, {
          params: {
            company_id: resolvedCompanyIds,
            ...filteredParams,
          },
          paramsSerializer: (params) => {
            const companyIdParams = Array.isArray(params.company_id)
              ? params.company_id
                  .map((id: string) => `company_id=${encodeURIComponent(id)}`)
                  .join('&')
              : `company_id=${encodeURIComponent(params.company_id)}`;

            const otherParams = Object.entries(params)
              .filter(([key]) => key !== 'company_id')
              .flatMap(([key, value]) => {
                if (Array.isArray(value)) {
                  return value.map((v) => `${key}=${encodeURIComponent(v)}`);
                }
                return [`${key}=${encodeURIComponent(value)}`];
              })
              .join('&');

            return [companyIdParams, otherParams].filter(Boolean).join('&');
          },
        });

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message ||
              'Failed to fetch sales invoice data'
          );
        }
        throw error;
      }
    },
    enabled: isValidRequest && page >= 1 && limit > 0,
    staleTime: 60 * 1000,
    retry: 3,
    placeholderData: (previousData) => previousData,
  });

  return {
    data: data?.data,
    total: data?.totalRecords,
    grandTotal_amount: data?.grandTotal_amount,
    isLoading,
    isFetching,
    error,
    ...rest,
  };
};

export default useSalesInvoiceHd;

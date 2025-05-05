// src/hooks/useSalesInvoiceHd.ts
import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useMonthYearPeriodStore,
  useSalesInvoiceHdFilterStore,
  useSearchParamsStore, // Tambahkan kembali
} from '@/store';
import { SalesInvoiceHd } from '@/types';
import { format } from 'date-fns';
import { SEARCH_CONTEXTS } from '@/constants/searchContexts';

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

  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
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

  const period =
    context === 'salesInvoice' ? salesInvoicePeriod : salesPersonInvoicePeriod;
  const storeFilters =
    context === 'salesInvoice'
      ? salesInvoiceFilters
      : salesPersonInvoiceFilters;

  const isValidRequest = Boolean(company_id && module_id);

  const buildFilteredParams = (
    base: Record<string, any>,
    extra: {
      startPeriod?: Date | null;
      endPeriod?: Date | null;
      paidStatus?: string[];
      poType?: string[];
      salesPersonName?: string[];
      searchBy?: string;
      searchTerm?: string;
    }
  ): Record<string, any> => {
    const result = Object.fromEntries(
      Object.entries(base).filter(([_, value]) => {
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

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceHdResponse,
    Error
  >({
    queryKey: [
      'salesInvoiceHd',
      company_id,
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
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request: company_id or module_id missing');
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

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd`;

      const response = await api.get<SalesInvoiceHdResponse>(url, {
        params: filteredParams,
        paramsSerializer: (params) => {
          const queryString = new URLSearchParams(
            Object.entries(params).flatMap(([key, value]) => {
              if (Array.isArray(value)) {
                return value.map((v) => [key, v]);
              }
              return [[key, value]];
            })
          ).toString();
          return queryString;
        },
      });

      return response.data;
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

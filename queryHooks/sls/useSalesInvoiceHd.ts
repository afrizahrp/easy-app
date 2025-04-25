import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useSearchParamsStore,
  useMonthYearPeriodStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';

import { SalesInvoiceHd } from '@/types';
import { format } from 'date-fns';

interface SalesInvoiceHdResponse {
  data: SalesInvoiceHd[];
  totalRecords: number;
  grandTotal_amount?: number;
}

interface UseSalesInvoiceHdParams {
  page: number;
  limit: number;
  searchBy?: string;
  searchTerm?: string;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

const useSalesInvoiceHd = ({
  page,
  limit,
  searchBy,
  searchTerm,
  orderBy,
  orderDir,
}: UseSalesInvoiceHdParams) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id.toLocaleUpperCase();
  // const module_id = useModuleStore((state) => state.moduleId);
  const module_id = 'SLS';
  const searchParams = useSearchParamsStore((state) => state.searchParams);

  const { startPeriod, endPeriod } = useMonthYearPeriodStore();
  const { paidStatus, poType, salesPersonName } =
    useSalesInvoiceHdFilterStore();

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
    }

    if (extra.paidStatus?.length) {
      result.paidStatus = extra.paidStatus; //.join(',');
    }

    if (extra.salesPersonName?.length) {
      result.salesPersonName = extra.salesPersonName; //.join(',');
    }

    if (extra.poType?.length) {
      result.poType = extra.poType; //.join(',');
    }

    if (extra.searchBy && extra.searchTerm) {
      result.searchBy = extra.searchBy;
      result.searchTerm = extra.searchTerm;
    }

    return result;
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
      JSON.stringify(searchParams),
      startPeriod,
      endPeriod,
      paidStatus,
      poType,
      salesPersonName,
      searchBy,
      searchTerm,
      orderBy,
      orderDir,
    ],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request: company_id or module_id missing');
      }

      const filteredParams = buildFilteredParams(
        { page, limit, orderBy, orderDir, ...searchParams },
        {
          paidStatus,
          salesPersonName,
          poType,
          startPeriod,
          endPeriod,
          searchBy,
          searchTerm,
        }
      );

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd`;

      const response = await api.get<SalesInvoiceHdResponse>(url, {
        params: filteredParams,
        paramsSerializer: (params) => {
          return new URLSearchParams(
            Object.entries(params).flatMap(([key, value]) => {
              if (Array.isArray(value)) {
                return value.map((v) => [key, v]);
              }
              return [[key, value]];
            })
          ).toString();
        },
      });

      // const response = await api.get<SalesInvoiceHdResponse>(url, {
      //   params: filteredParams,
      // });

      return response.data;
    },
    enabled: isValidRequest,
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

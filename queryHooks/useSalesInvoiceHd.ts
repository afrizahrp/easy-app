import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useSearchParamsStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';
import { SalesInvoiceHd } from '@/types';
import { format } from 'date-fns';

interface SalesInvoiceHdResponse {
  data: SalesInvoiceHd[];
  totalRecords: number;
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
  const module_id = useModuleStore((state) => state.moduleId);
  const searchParams = useSearchParamsStore((state) => state.searchParams);
  const { status, salesPersonName, startPeriod, endPeriod, poType } =
    useSalesInvoiceHdFilterStore();

  const isValidRequest = Boolean(company_id && module_id);

  const buildFilteredParams = (
    base: Record<string, any>,
    extra: {
      status?: string[];
      salesPersonName?: string[];
      poType?: string[];
      searchBy?: string;
      searchTerm?: string;
      startPeriod?: Date | null;
      endPeriod?: Date | null;
    }
  ): Record<string, any> => {
    const result = Object.fromEntries(
      Object.entries(base).filter(([_, value]) => {
        if (typeof value === 'string') return value.trim() !== '';
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined;
      })
    );

    if (extra.status?.length) {
      result.status = extra.status.join(',');
    }

    if (extra.salesPersonName?.length) {
      result.salesPersonName = extra.salesPersonName.join(',');
    }

    if (extra.poType?.length) {
      result.poType = extra.poType.join(',');
    }

    if (extra.searchBy && extra.searchTerm) {
      result.searchBy = extra.searchBy;
      result.searchTerm = extra.searchTerm;
    }

    if (extra.startPeriod) {
      result.startPeriod = format(extra.startPeriod, 'MMMyyyy');
    }

    if (extra.endPeriod) {
      result.endPeriod = format(extra.endPeriod, 'MMMyyyy');
    }

    console.log('Filtered params:', result);

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
      status,
      salesPersonName,
      poType,
      startPeriod,
      endPeriod,
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
          status,
          salesPersonName,
          poType,
          startPeriod,
          endPeriod,
          searchBy,
          searchTerm,
        }
      );

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd`;

      console.log('Sending request to:', url, 'with params:', filteredParams);

      const response = await api.get<SalesInvoiceHdResponse>(url, {
        params: filteredParams,
      });

      console.log('Backend response:', response.data);

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
    isLoading,
    isFetching,
    error,
    ...rest,
  };
};

export default useSalesInvoiceHd;

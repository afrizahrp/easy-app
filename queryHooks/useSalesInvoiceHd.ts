import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useSearchParamsStore,
  useSalesInvoiceHdFilterStore,
} from '@/store';
import { SalesInvoiceHd } from '@/types';

interface SalesInvoiceHdResponse {
  data: SalesInvoiceHd[];
  totalRecords: number;
}

interface UseCategoryParams {
  page: number;
  limit: number;
  searchBy?: string;
  searchTerm?: string;
}

const useSalesInvoiceHd = ({
  page,
  limit,
  searchBy,
  searchTerm,
}: UseCategoryParams) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = 'SLS';

  const searchParams = useSearchParamsStore((state) => state.searchParams);
  const status = useSalesInvoiceHdFilterStore((state) => state.status);
  const salesPersonName = useSalesInvoiceHdFilterStore(
    (state) => state.salesPersonName
  );

  const isValidRequest = Boolean(company_id && module_id);

  const buildFilteredParams = (
    base: Record<string, any>,
    extra: {
      status?: string[];
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

    if (extra.status?.length) {
      result.status = extra.status.join(',');
    }

    if (extra.salesPersonName?.length) {
      result.salesPersonName = extra.salesPersonName.join(',');
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
      status,
      salesPersonName,
      searchBy,
      searchTerm,
    ],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request: company_id or module_id missing');
      }

      const filteredParams = buildFilteredParams(
        { page, limit, ...searchParams },
        { status, salesPersonName, searchBy, searchTerm }
      );

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd`;

      const response = await api.get<SalesInvoiceHdResponse>(url, {
        params: filteredParams,
      });

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

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
}

const useSalesInvoiceHd = ({ page, limit }: UseCategoryParams) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = 'SLS';

  const searchParams = useSearchParamsStore((state) => state.searchParams);
  const status = useSalesInvoiceHdFilterStore((state) => state.status);
  const salesPersonName = useSalesInvoiceHdFilterStore(
    (state) => state.salesPersonName
  );

  const isValidRequest = Boolean(company_id && module_id);
  const hasSearchParams = Object.values(searchParams).some(
    (value) =>
      (typeof value === 'string' && value.trim() !== '') ||
      (Array.isArray(value) && value.length > 0)
  );

  const buildFilteredParams = (
    base: Record<string, any>,
    extra: { status?: string[]; salesPersonName?: string[] }
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
    ],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request: company_id or module_id missing');
      }

      const filteredParams = buildFilteredParams(
        { page, limit, ...searchParams },
        { status, salesPersonName }
      );

      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd`;
      const url = hasSearchParams ? `${baseUrl}/filter` : baseUrl;

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

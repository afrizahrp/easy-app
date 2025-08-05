import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSalesInvoiceHdFilterStore,
  useMonthYearPeriodStore,
  useCompanyFilterStore,
} from '@/store';
import { format } from 'date-fns';
import { AxiosError } from 'axios';
import { useMemo } from 'react';

interface ProductSoldItem {
  productName: string;
  qty: number;
  total_amount: number;
}

interface ProductSoldCountResponse {
  company_id: string[];
  module_id: string;
  subModule_id: string;
  salesPersonName: string[];
  data: ProductSoldItem[];
}

interface UseMonthlyProductSoldFromSalesPersonFilteredProps {
  context: 'salesPersonInvoice';
  salesPersonName?: string | string[];
  year?: string;
  month?: string;
  sortBy?: string;
  enabled?: boolean;
}

const useMonthlyProductSoldFromSalesPersonFiltered = ({
  context,
  salesPersonName: propSalesPersonName,
  year,
  month,
  sortBy,
  enabled = true,
}: UseMonthlyProductSoldFromSalesPersonFilteredProps) => {
  const { selectedCompanyIds } = useCompanyFilterStore();
  const module_id = 'ANT';
  const subModule_id = 'sls';

  const { salesPersonInvoicePeriod } = useMonthYearPeriodStore();
  const { salesPersonInvoiceFilters } = useSalesInvoiceHdFilterStore();

  const { salesPersonName: storeSalesPersonName } = salesPersonInvoiceFilters;

  // Memoize resolvedCompanyId untuk stabilitas
  const resolvedCompanyId = useMemo(
    () => (selectedCompanyIds.length > 0 ? selectedCompanyIds : ['BIS']),
    [selectedCompanyIds]
  );

  // Handle salesPersonName dari berbagai sumber
  const resolvedSalesPersonName = useMemo(() => {
    // Prioritaskan prop salesPersonName
    if (propSalesPersonName) {
      return Array.isArray(propSalesPersonName)
        ? propSalesPersonName
        : [propSalesPersonName];
    }

    // Fallback ke store salesPersonName
    if (storeSalesPersonName.length > 0) {
      return storeSalesPersonName.map((name) => name?.trim()).filter(Boolean);
    }

    return [];
  }, [propSalesPersonName, storeSalesPersonName]);

  // Prioritaskan prop year dan month, fallback ke salesPersonInvoicePeriod
  const yearPeriod =
    year ||
    (salesPersonInvoicePeriod.startPeriod
      ? format(salesPersonInvoicePeriod.startPeriod, 'yyyy')
      : new Date().getFullYear().toString());
  const monthPeriod =
    month ||
    (salesPersonInvoicePeriod.startPeriod
      ? format(salesPersonInvoicePeriod.startPeriod, 'MMM')
      : format(new Date(), 'MMM'));

  // Debugging: Log nilai prop dan periode
  console.log(
    `[useMonthlyProductSoldFromSalesPersonFiltered:${context}] Input props:`,
    {
      propSalesPersonName,
      year,
      month,
      sortBy,
      yearPeriod,
      monthPeriod,
      resolvedSalesPersonName,
      resolvedCompanyId,
    }
  );

  const isValidRequest = Boolean(
    resolvedCompanyId.length > 0 &&
      module_id &&
      subModule_id &&
      resolvedSalesPersonName.length > 0 &&
      yearPeriod &&
      monthPeriod
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    ProductSoldCountResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      'MonthlyProductSoldFromSalesPersonFiltered',
      context,
      resolvedCompanyId,
      module_id || 'unknown',
      subModule_id || 'unknown',
      resolvedSalesPersonName,
      yearPeriod,
      monthPeriod,
      sortBy || 'qty',
    ],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error(
          'Invalid request parameters: salesPersonName and either yearPeriod or monthPeriod are required'
        );
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${module_id}/${subModule_id}/get-analytics/getMonthlyProductSoldFromSalesPersonFiltered`;

      try {
        const response = await api.get<ProductSoldCountResponse>(url, {
          params: {
            company_id: resolvedCompanyId,
            salesPersonName: resolvedSalesPersonName,
            yearPeriod,
            monthPeriod,
            sortBy: sortBy || 'qty',
          },
          paramsSerializer: (params) => {
            const companyIdParams = Array.isArray(params.company_id)
              ? params.company_id
                  .map((id: string) => `company_id=${encodeURIComponent(id)}`)
                  .join('&')
              : `company_id=${encodeURIComponent(params.company_id)}`;

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

            const yearPeriodParam = params.yearPeriod
              ? `yearPeriod=${encodeURIComponent(params.yearPeriod)}`
              : '';

            const monthPeriodParam = params.monthPeriod
              ? `monthPeriod=${encodeURIComponent(params.monthPeriod)}`
              : '';

            const sortByParam = params.sortBy
              ? `sortBy=${encodeURIComponent(params.sortBy)}`
              : '';

            return [
              companyIdParams,
              salesPersonNameParams,
              yearPeriodParam,
              monthPeriodParam,
              sortByParam,
            ]
              .filter(Boolean)
              .join('&');
          },
        });

        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        throw new Error(
          axiosError.response?.data?.message ||
            'Failed to fetch top products data'
        );
      }
    },
    enabled: isValidRequest && enabled,
    staleTime: 60 * 1000,
    retry: (failureCount, err) => {
      if (
        err instanceof AxiosError &&
        (err.response?.status === 400 || err.response?.status === 404)
      ) {
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

export default useMonthlyProductSoldFromSalesPersonFiltered;

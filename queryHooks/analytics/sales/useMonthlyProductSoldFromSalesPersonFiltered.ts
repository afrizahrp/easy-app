import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useSalesInvoiceHdFilterStore,
  useMonthYearPeriodStore,
} from '@/store';
import { format } from 'date-fns';
import { AxiosError } from 'axios';

interface ProductSoldItem {
  productName: string;
  qty: number;
  total_amount: number;
}

interface ProductSoldCountResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  salesPersonName: string;
  data: ProductSoldItem[];
}

interface UseMonthlyProductSoldFromSalesPersonFilteredProps {
  context: 'salesPersonInvoice';
  salesPersonName?: string;
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
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'SLS';
  const subModule_id = 'sls';

  const { salesPersonInvoicePeriod } = useMonthYearPeriodStore();
  const { salesPersonInvoiceFilters } = useSalesInvoiceHdFilterStore();

  const { salesPersonName: storeSalesPersonName } = salesPersonInvoiceFilters;

  const finalSalesPersonName =
    propSalesPersonName?.trim() ||
    (storeSalesPersonName.length > 0 ? storeSalesPersonName[0]?.trim() : '');

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
      finalSalesPersonName,
    }
  );

  const isValidRequest = Boolean(
    company_id &&
      module_id &&
      subModule_id &&
      finalSalesPersonName &&
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
      company_id || 'unknown',
      module_id || 'unknown',
      subModule_id || 'unknown',
      finalSalesPersonName || 'unknown',
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

      const params = new URLSearchParams();
      params.append('salesPersonName', finalSalesPersonName);
      params.append('yearPeriod', yearPeriod);
      params.append('monthPeriod', monthPeriod);
      if (sortBy) {
        params.append('sortBy', sortBy);
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-analytics/getMonthlyProductSoldFromSalesPersonFiltered`;
      const finalUrl = `${url}?${params.toString()}`;

      console.log(
        `[useMonthlyProductSoldFromSalesPersonFiltered:${context}] finalUrl:`,
        finalUrl
      );

      try {
        const response = await api.get<ProductSoldCountResponse>(finalUrl);
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

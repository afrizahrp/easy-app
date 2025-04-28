import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useSalesInvoiceHdFilterStore } from '@/store';
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

interface UseTopProductsBySalesPersonProps {
  salesPersonName?: string;
  yearPeriod?: string;
  monthPeriod?: string;
  sortBy?: string;
  enabled?: boolean;
}

const useTopProductsBySalesPerson = ({
  salesPersonName: propSalesPersonName,
  yearPeriod,
  monthPeriod,
  sortBy,
  enabled = true,
}: UseTopProductsBySalesPersonProps) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'ANT';
  const subModule_id = 'sls';

  const { salesPersonName: storeSalesPersonName } =
    useSalesInvoiceHdFilterStore((state) => ({
      salesPersonName: state.salesPersonName,
    }));

  const finalSalesPersonName =
    propSalesPersonName?.trim() ||
    (storeSalesPersonName.length > 0 ? storeSalesPersonName[0]?.trim() : '');

  const finalYearPeriod = yearPeriod?.trim() || null;
  const finalMonthPeriod = monthPeriod?.trim() || null;

  const isValidRequest = Boolean(
    company_id &&
      module_id &&
      subModule_id &&
      finalSalesPersonName &&
      (finalYearPeriod?.trim() || finalMonthPeriod?.trim())
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    ProductSoldCountResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      'topProductsBySalesPerson',
      company_id,
      module_id,
      subModule_id,
      finalSalesPersonName,
      finalYearPeriod,
      finalMonthPeriod,
      sortBy,
    ],

    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error(
          'Invalid request parameters: salesPersonName and either yearPeriod or monthPeriod are required'
        );
      }

      const params = new URLSearchParams();
      params.append('salesPersonName', finalSalesPersonName);

      if (yearPeriod) {
        params.append('yearPeriod', yearPeriod);
      }

      if (monthPeriod) {
        params.append('monthPeriod', monthPeriod);
      }

      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-analytics/getProductSoldCountBySalesPerson`; // Perbarui URL sesuai backend
      const finalUrl = `${url}?${params.toString()}`; // Gabungkan URL dan query params

      console.log('FinalUrl:', finalUrl); // Debugging log

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
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        if (status === 400 || status === 404) {
          return false;
        }
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

export default useTopProductsBySalesPerson;

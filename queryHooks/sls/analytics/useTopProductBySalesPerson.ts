import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useMonthYearPeriodStore,
  useSalesInvoiceHdFilterStore,
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

interface UseTopProductsBySalesPersonProps {
  salesPersonName?: string; // Opsional, bisa diambil dari store jika tidak diberikan
  enabled?: boolean;
}

const useTopProductsBySalesPerson = ({
  salesPersonName: propSalesPersonName,
  enabled = true,
}: UseTopProductsBySalesPersonProps) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id?.toUpperCase();
  const module_id = 'ANT';
  const subModule_id = 'sls';

  const { startPeriod, endPeriod } = useMonthYearPeriodStore();
  const { salesPersonName: storeSalesPersonName } =
    useSalesInvoiceHdFilterStore((state) => ({
      salesPersonName: state.salesPersonName,
      poType: state.poType,
      paidStatus: state.paidStatus,
    }));

  // Gunakan salesPersonName dari props jika ada, kalau tidak dari store
  const finalSalesPersonName =
    propSalesPersonName?.trim() ||
    (storeSalesPersonName.length > 0 ? storeSalesPersonName[0]?.trim() : '');

  const isValidRequest = Boolean(
    company_id &&
      module_id &&
      subModule_id &&
      finalSalesPersonName &&
      startPeriod instanceof Date &&
      endPeriod instanceof Date
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
      startPeriod,
      endPeriod,
    ],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error(
          'Invalid request parameters: salesPersonName, startPeriod, and endPeriod are required'
        );
      }

      const params = new URLSearchParams();
      params.append('salesPersonName', finalSalesPersonName);
      if (startPeriod) {
        params.append('startPeriod', format(startPeriod, 'MMMyyyy'));
      }
      if (endPeriod) {
        params.append('endPeriod', format(endPeriod, 'MMMyyyy'));
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/${subModule_id}/get-analytics/getProductSoldCountBySalesPerson`;
      const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;

      console.log('salesPersonName:', finalSalesPersonName);
      console.log('Query params:', params.toString());
      console.log('finalUrl:', finalUrl);

      try {
        const response = await api.get<ProductSoldCountResponse>(finalUrl, {
          paramsSerializer: (params) => params.toString(),
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
      if (err instanceof AxiosError && err.response?.status === 400) {
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

export default useTopProductsBySalesPerson;

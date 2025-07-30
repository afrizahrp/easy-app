import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useCompanyFilterStore,
  useSalesInvoiceHdFilterStore,
  useMonthYearPeriodStore,
} from '@/store';
import { format } from 'date-fns';
import { useMemo } from 'react';
import axios from 'axios';

interface SalesByPoTypeResponse {
  company_id: string;
  module_id: string;
  subModule_id: string;
  data: {
    period: string;
    poType: string;
    totalInvoice: number;
    months: Record<string, { amount: number; growthPercentage?: number }>;
  }[];
}

interface UseMonthlySalesInvoiceByPoTypeProps {
  context: 'salesInvoice';
  poTypes?: string[];
}

const useMonthlySalesInvoiceByPoType = ({
  context,
  poTypes = ['Regular', 'eCatalog'], // Default ke Regular dan eCatalog
}: UseMonthlySalesInvoiceByPoTypeProps) => {
  const { selectedCompanyIds } = useCompanyFilterStore();
  const module_id = 'SLS';
  const subModule_id = 'sls';

  const { salesInvoicePeriod, salesPersonInvoicePeriod } =
    useMonthYearPeriodStore();
  const { salesInvoiceFilters } = useSalesInvoiceHdFilterStore();

  const { poType: storePoType } = salesInvoiceFilters;

  const resolvedCompanyIds = useMemo(
    () => (selectedCompanyIds.length > 0 ? selectedCompanyIds : ['BIS']),
    [selectedCompanyIds]
  );

  const period =
    context === 'salesInvoice' ? salesInvoicePeriod : salesPersonInvoicePeriod;

  const { startPeriod, endPeriod } = useMemo(() => {
    const formatPeriod = (date: Date | null): string | null => {
      if (!date) return null;
      return format(date, 'MMMyyyy');
    };
    return {
      startPeriod: formatPeriod(period.startPeriod),
      endPeriod: formatPeriod(period.endPeriod),
    };
  }, [period.startPeriod, period.endPeriod]);

  const isValidRequest = useMemo(
    () =>
      Boolean(
        resolvedCompanyIds &&
          module_id &&
          subModule_id &&
          startPeriod &&
          endPeriod
      ),
    [resolvedCompanyIds, module_id, subModule_id, startPeriod, endPeriod]
  );

  const validPoTypes = useMemo(
    () =>
      poTypes && Array.isArray(poTypes) && poTypes.length
        ? poTypes.filter(
            (poType) => typeof poType === 'string' && poType.trim()
          )
        : storePoType?.length
          ? storePoType.filter(
              (poType) => typeof poType === 'string' && poType.trim()
            )
          : ['Regular', 'eCatalog'], // Fallback ke Regular dan eCatalog
    [poTypes, storePoType]
  );

  const queryKey = useMemo(
    () => [
      'salesByPeriodAndPoType',
      context,
      resolvedCompanyIds,
      module_id,
      subModule_id,
      startPeriod,
      endPeriod,
      validPoTypes,
    ],
    [
      context,
      resolvedCompanyIds,
      module_id,
      subModule_id,
      startPeriod,
      endPeriod,
      validPoTypes,
    ]
  );

  const { data, isLoading, isFetching, error, ...rest } = useQuery<
    SalesByPoTypeResponse,
    Error
  >({
    queryKey,
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${module_id}/${subModule_id}/get-analytics/getMonthlySalesInvoiceByPoType`;

      try {
        const response = await api.get<SalesByPoTypeResponse>(url, {
          params: {
            company_id: resolvedCompanyIds,
            startPeriod,
            endPeriod,
            poType: validPoTypes?.length ? validPoTypes : undefined,
          },
          paramsSerializer: (params) => {
            const companyIdParams = Array.isArray(params.company_id)
              ? params.company_id
                  .map((id: string) => `company_id=${encodeURIComponent(id)}`)
                  .join('&')
              : `company_id=${encodeURIComponent(params.company_id)}`;

            const startPeriodParam = params.startPeriod
              ? `startPeriod=${encodeURIComponent(params.startPeriod)}`
              : '';

            const endPeriodParam = params.endPeriod
              ? `endPeriod=${encodeURIComponent(params.endPeriod)}`
              : '';

            const poTypeParams = Array.isArray(params.poType)
              ? params.poType
                  .map((type: string) => `poType=${encodeURIComponent(type)}`)
                  .join('&')
              : params.poType
                ? `poType=${encodeURIComponent(params.poType)}`
                : '';

            return [
              companyIdParams,
              startPeriodParam,
              endPeriodParam,
              poTypeParams,
            ]
              .filter(Boolean)
              .join('&');
          },
        });

        console.log(
          `[useMonthlySalesInvoiceByPoType:${context}] URL: ${url}, Response: ${JSON.stringify(response.data)}`
        );

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || 'Failed to fetch sales data'
          );
        }
        throw error;
      }
    },
    enabled: isValidRequest,
    staleTime: 60 * 1000,
    retry: 3,
  });

  return {
    data: data?.data ?? [],
    isLoading,
    isFetching,
    error,
    ...rest,
  };
};

export default useMonthlySalesInvoiceByPoType;

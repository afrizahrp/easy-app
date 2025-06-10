import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useModuleStore } from '@/store';
import { SalesInvoiceDetailResponse } from '@/types';

interface UseSalesInvoiceDtParams {
  invoiceId: string;
}

const useSalesInvoiceDt = ({ invoiceId }: UseSalesInvoiceDtParams) => {
  const user = useSessionStore((state) => state.user);
  // const module_id = useModuleStore((state) => state.moduleId); // Ambil module_id dari store
  const company_id = user?.company_id.toLocaleUpperCase();

  const module_id = 'SLS';
  // const company_id = 'SLS';

  const isValidRequest = Boolean(company_id && module_id && invoiceId);
  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    SalesInvoiceDetailResponse,
    Error
  >({
    queryKey: ['salesInvoiceDt', company_id, invoiceId],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request: company_id or invoice_id missing');
      }

      const encodedInvoiceId = encodeURIComponent(invoiceId);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-invoiceHd/detail/${encodedInvoiceId}`;

      // http://localhost:8000/BIS/SLS/get-invoiceDt/BISN%2F2024%2F07%2F100023

      const response = await api.get<SalesInvoiceDetailResponse>(url);
      return response.data;
    },
    enabled: isValidRequest,
    staleTime: 60 * 1000,
    retry: 2,
    placeholderData: (prev) => prev,
  });

  return {
    data,
    isLoading,
    isFetching,
    error,
    ...rest,
  };
};

export default useSalesInvoiceDt;

import useSalesInvoiceHdPaidStatus from '@/queryHooks/sls/useSalesInvoiceHdPaidStatus';
import { AxiosError } from 'axios';

interface OptionType {
  value: string;
  label: string;
  count: number;
}

interface UseSalesInvoiceHdStatusOptionsProps {
  context: 'salesInvoice' | 'salesPersonInvoice';
}

export default function useSalesInvoiceHdStatusOptions({
  context,
}: UseSalesInvoiceHdStatusOptionsProps) {
  const {
    data: statusData,
    isLoading,
    error,
  } = useSalesInvoiceHdPaidStatus({ context });

  const options =
    statusData?.map((status) => ({
      value: status.name,
      label: `${status.name} (${status.count.toLocaleString()})`,
      count: isNaN(Number(status.count)) ? 0 : Number(status.count), // Validasi count
    })) || [];

  console.log(`[useSalesInvoiceHdStatusOptions:${context}] Error:`, error);

  return { options, isLoading, error };
}

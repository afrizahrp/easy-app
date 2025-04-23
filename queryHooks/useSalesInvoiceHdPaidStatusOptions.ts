import useSalesInvoiceHdPaidStatus from '@/queryHooks/useSalesInvoiceHdPaidStatus';

interface OptionType {
  value: string;
  label: string;
  count: number;
}

export default function useSalesInvoiceHdStatusOptions() {
  const { data: statusData, isLoading } = useSalesInvoiceHdPaidStatus();

  const options =
    statusData?.map((status) => ({
      value: status.name, // Sesuaikan dengan format API
      label: status.name, // Tambahkan count dengan pemisah ribuan di label
      count: Number(status.count), // Pastikan count tetap number
    })) || [];

  return { options, isLoading };
}

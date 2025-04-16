import useSalesInvoiceHdPaidStatus from '@/queryHooks/useSalesInvoiceHdPaidStatus';

interface OptionType {
  value: string;
  label: string;
  count: number;
}

// export default function useSalesInvoiceHdStatusOptions(
//   statusCounts?: Record<string, number>
// ) {

export default function useSalesInvoiceHdStatusOptions() {
  const { data: statusData, isLoading } = useSalesInvoiceHdPaidStatus();

  const options =
    statusData?.map((status) => ({
      value: status.id, // Sesuaikan dengan format API
      label: status.name, //(${status.count})`, // Menampilkan count dari API
      // count: Number(status.count), // Pastikan count dalam bentuk number
    })) || [];

  return { options, isLoading };
}

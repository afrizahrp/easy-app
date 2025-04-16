import useSalesInvoiceHdSalesPerson from '@/queryHooks/useSalesInvoiceHdSalesPerson';

interface useSalesInvoiceHdSalesPersonOptions {
  id: string;
  name: string;
  count: number;
}

// export default function useSalesInvoiceHdStatusOptions(
//   statusCounts?: Record<string, number>
// ) {

export default function useSalesInvoiceHdSalesPersonOptions() {
  const { data: salesPersonData, isLoading } = useSalesInvoiceHdSalesPerson();

  const options =
    salesPersonData?.map((salesPersonList) => ({
      value: salesPersonList.id, // Sesuaikan dengan format API
      label: salesPersonList.name, //(${status.count})`, // Menampilkan count dari API
      // count: Number(status.count), // Pastikan count dalam bentuk number
    })) || [];

  return { options, isLoading };
}

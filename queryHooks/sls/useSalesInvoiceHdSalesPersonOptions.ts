import useSalesInvoiceHdSalesPerson from '@/queryHooks/sls/useSalesInvoiceHdSalesPerson';

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
      label: salesPersonList.name, // `${salesPersonList.name} (${salesPersonList.count.toLocaleString('id-ID')})`, // Format count dengan pemisah ribuan
      count: Number(salesPersonList.count), // Pastikan count dalam bentuk number
    })) || [];

  return { options, isLoading };
}

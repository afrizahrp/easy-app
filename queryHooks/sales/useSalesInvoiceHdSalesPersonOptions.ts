import useSalesInvoiceHdSalesPerson from '@/queryHooks/sales/useSalesInvoiceHdSalesPerson';

interface useSalesInvoiceHdSalesPersonPropOptions {
  context: 'salesInvoice' | 'salesPersonInvoice';
}

export default function useSalesInvoiceHdSalesPersonOptions({
  context,
}: useSalesInvoiceHdSalesPersonPropOptions) {
  const {
    data: salesPersonData,
    isLoading,
    error,
  } = useSalesInvoiceHdSalesPerson({
    context,
  });

  const options =
    salesPersonData?.map((salesPersonList) => ({
      value: salesPersonList.id, // Sesuaikan dengan format API
      label: salesPersonList.name, // `${salesPersonList.name} (${salesPersonList.count.toLocaleString('id-ID')})`, // Format count dengan pemisah ribuan
      count: Number(salesPersonList.count), // Pastikan count dalam bentuk number
    })) || [];

  return { options, isLoading, error };
}

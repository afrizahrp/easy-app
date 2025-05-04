import useSalesInvoiceHdPoType from '@/queryHooks/sls/useSalesInvoiceHdPoType';

interface UseSalesInvoiceHdPoTypeProps {
  context: 'salesInvoice' | 'salesPersonInvoice';
}

export default function useSalesInvoiceHdPoTypeOptions({
  context,
}: UseSalesInvoiceHdPoTypeProps) {
  const {
    data: poTypeData,
    isLoading,
    error,
  } = context === 'salesInvoice'
    ? useSalesInvoiceHdPoType({ context })
    : { data: [], isLoading: false };

  const options =
    poTypeData?.map((poTypeList) => ({
      value: poTypeList.id, // Sesuaikan dengan format API
      label: poTypeList.name, // Tambahkan count dengan pemisah ribuan di label
      count: Number(poTypeList.count), // Pastikan count tetap number
    })) || [];

  return { options, isLoading, error };
}

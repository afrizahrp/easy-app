import useSalesInvoiceHdPoType from '@/queryHooks/useSalesInvoiceHdPoType';

interface OptionType {
  value: string;
  label: string;
  count: number;
}

export default function useSalesInvoiceHdPoTypeOptions() {
  const { data: poTypeData, isLoading } = useSalesInvoiceHdPoType();

  const options =
    poTypeData?.map((poTypeList) => ({
      value: poTypeList.id, // Sesuaikan dengan format API
      label: poTypeList.name, // Tambahkan count dengan pemisah ribuan di label
      count: Number(poTypeList.count), // Pastikan count tetap number
    })) || [];

  return { options, isLoading };
}

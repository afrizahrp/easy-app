import useCategoryType from '@/queryHooks/useCategoryType';

interface OptionType {
  value: string;
  label: string;
  count: number;
}

export default function useCategoryStatusOptions(
  statusCounts?: Record<string, number>
) {
  const { data: typeData, isLoading } = useCategoryType();

  const typeOptions =
    typeData?.map((type) => ({
      value: type.id, // Sesuaikan dengan format API
      label: type.name, //(${type.count})`, // Menampilkan count dari API
      // count: Number(type.count), // Pastikan count dalam bentuk number
    })) || [];

  return { typeOptions, isLoading };
}

import useCategoryStatus from '@/queryHooks/useCategoryStatus';

interface OptionType {
  value: string;
  label: string;
  count: number;
}

// export default function useCategoryStatusOptions(
//   statusCounts?: Record<string, number>
// ) {

export default function useCategoryStatusOptions() {
  const { data: statusData, isLoading } = useCategoryStatus();

  const options =
    statusData?.map((status) => ({
      value: status.id, // Sesuaikan dengan format API
      label: status.name, //(${status.count})`, // Menampilkan count dari API
      // count: Number(status.count), // Pastikan count dalam bentuk number
    })) || [];

  return { options, isLoading };
}

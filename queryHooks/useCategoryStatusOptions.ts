import { useCategoryStatus } from '@/queryHooks/useCategoryStatus';

type OptionType = { value: string; label: string; count: number };

const useCategoryStatusOptions = (statusCounts?: Record<string, number>) => {
  const { data: statusData, isLoading } = useCategoryStatus();

  const statusList: OptionType[] | undefined = statusData?.map((status) => ({
    value: status.id,
    label: `${status.name} (${statusCounts?.[status.id] ?? status.count})`, // ✅ Gunakan API jika statusCounts tidak ada
    count: statusCounts?.[status.id] ?? Number(status.count), // ✅ Gunakan API sebagai fallback
  }));

  console.log('Status List:', statusList); // ✅ Debugging data dari API

  return { options: statusList, isLoading };
};

export default useCategoryStatusOptions;

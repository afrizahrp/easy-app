import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useModuleStore } from '@/store';

interface CategoryStatus {
  id: string;
  name: string;
  count: number; // ✅ Ubah ke number agar mudah diproses
}

interface CategoryStatusResponse {
  data: CategoryStatus[];
}

export const useCategoryStatus = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);

  const isEnabled = !!company_id && !!module_id;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    CategoryStatusResponse,
    Error
  >({
    queryKey: ['categoryStatus', company_id, module_id],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-categories/statuses`;
      const response = await api.get<CategoryStatusResponse>(url);
      return response.data;
    },
    enabled: isEnabled,
    staleTime: 60 * 1000,
    retry: 3,
  });

  // console.log('Category Status:', data); // ✅ Debugging data dari API

  return {
    data: data?.data,
    isLoading,
    error,
    ...rest,
  };
};

export default useCategoryStatus;

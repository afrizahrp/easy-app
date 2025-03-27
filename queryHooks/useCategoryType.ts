import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useModuleStore } from '@/store';

interface CategoryType {
  id: string;
  name: string;
  count: number; // ✅ Ubah ke number agar mudah diproses
}

interface CategoryTypeResponse {
  data: CategoryType[];
}

export const useCategoryType = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);

  const isEnabled = !!company_id && !!module_id;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    CategoryTypeResponse,
    Error
  >({
    queryKey: ['CategoryType', company_id, module_id],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-categories/types`;
      const response = await api.get<CategoryTypeResponse>(url);
      return response.data;
    },
    enabled: isEnabled,
    staleTime: 60 * 1000,
    retry: 3,
  });

  return {
    data: data?.data,
    isLoading,
    error,
    ...rest,
  };
};

export default useCategoryType;

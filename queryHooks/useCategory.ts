import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useModuleStore } from '@/store';
import { Category } from '@/types';

interface CategoryResponse {
  data: Category[];
  totalRecords: number;
}

interface UseCategoryParams {
  page: number;
  limit: number;
  status?: string[]; // ✅ Pastikan status dalam bentuk array
}

export const useCategory = ({ page, limit, status }: UseCategoryParams) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-categories`;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    CategoryResponse,
    Error
  >({
    queryKey: [
      'categories',
      company_id,
      module_id,
      page,
      limit,
      status?.length ? status.join(',') : 'all', // ✅ Gunakan join agar lebih stabil
    ],
    queryFn: async () => {
      try {
        const params: Record<string, any> = { page, limit };

        // ✅ Tambahkan `status` sebagai array jika ada
        if (status?.length) {
          params.status = status;
        }

        const response = await api.get<CategoryResponse>(url, { params });
        return response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
      }
    },
    staleTime: 60 * 1000, // 60s
    retry: 3,
    placeholderData: (previousData) => previousData,
  });

  return {
    data: data?.data,
    total: data?.totalRecords,
    isLoading,
    isFetching,
    error,
    ...rest,
  };
};

export default useCategory;

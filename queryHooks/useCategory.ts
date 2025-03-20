import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/provider/auth.provider';
import { useModuleStore } from '@/store';
import { Category } from '@/types';

interface CategoryResponse {
  data: Category[];
  totalRecords: number;
}

export const useCategory = (page: number, limit: number) => {
  const { session } = useAuth();
  const company_id = session?.user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-categories`;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    CategoryResponse,
    Error
  >({
    queryKey: ['categories', company_id, module_id, page, limit],
    queryFn: async () => {
      try {
        const response = await api.get<CategoryResponse>(url, {
          params: { page, limit },
        });

        return response.data; // Kembalikan data dari respons
      } catch (error) {
        throw new Error('Failed to fetch categories'); // Tangani error
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
    isFetching, // Tambahkan untuk menampilkan loading hanya saat fetch baru

    error,
    ...rest,
  };
};

export default useCategory;

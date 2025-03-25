import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useModuleStore } from '@/store';
import { CategoryType } from '@/types';

interface CategoryTypeResponse {
  data: CategoryType[];
  totalRecords: number;
}

export const useCategoryTypes = (page: number, limit: number) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-categoryType`;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    CategoryTypeResponse,
    Error
  >({
    queryKey: ['categoryTypes', company_id, module_id],
    queryFn: async () => {
      try {
        const response = await api.get<CategoryTypeResponse>(url, {
          params: { page, limit },
        });

        return response.data; // Kembalikan data dari respons
      } catch (error) {
        throw new Error('Failed to fetch category types'); // Tangani error
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

export default useCategoryTypes;

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
  status?: string;
  categoryType?: string;
}

export const useCategory = ({
  page,
  limit,
  status,
  categoryType,
}: UseCategoryParams) => {
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
      status || null, // Jangan sertakan dalam queryKey jika undefined
      categoryType || null, // Jangan sertakan dalam queryKey jika undefined
    ].filter((item) => item !== null), // Hapus item `null` dari array queryKey
    queryFn: async () => {
      try {
        const params: Record<string, any> = { page, limit };

        // Hanya tambahkan `status` jika ada nilai
        if (status) {
          params.status = status;
        }

        // Hanya tambahkan `categoryType` jika ada nilai
        if (categoryType) {
          params.categoryType = categoryType;
        }

        const response = await api.get<CategoryResponse>(url, { params });
        return response.data;
      } catch (error) {
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

import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useCategoryFilterStore, // ✅ Import Zustand store
} from '@/store';
import { Category } from '@/types';

interface CategoryResponse {
  data: Category[];
  totalRecords: number;
}

interface UseCategoryParams {
  page: number;
  limit: number;
}

export const useCategory = ({ page, limit }: UseCategoryParams) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);

  // ✅ Pastikan nilai tidak undefined/null
  const isValidRequest = Boolean(company_id && module_id);

  const status = useCategoryFilterStore((state) => state.status);

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    CategoryResponse,
    Error
  >({
    queryKey: ['categories', company_id, module_id, page, limit, status],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request: company_id or module_id missing');
      }

      const params: Record<string, any> = { page, limit };

      if (status.length > 0) {
        params.status = status.join(','); // ✅ Kirim sebagai string "ACTIVE,INACTIVE"
      }

      console.log('🔥 Fetching Categories with Params:', params);

      const response = await api.get<CategoryResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-categories`,
        { params }
      );
      return response.data;
    },
    enabled: isValidRequest, // ✅ Gunakan boolean
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

import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import {
  useSessionStore,
  useModuleStore,
  useSearchParamsStore,
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

const useCategory = ({ page, limit }: UseCategoryParams) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);

  const isValidRequest = Boolean(company_id && module_id);

  // ✅ Ambil data dari Zustand
  const searchParams = useSearchParamsStore((state) => state.searchParams);
  const status = useCategoryFilterStore((state) => state.status);
  const categoryType = useCategoryFilterStore((state) => state.categoryType);

  const hasSearchParams = Object.values(searchParams).some(
    (value) =>
      (typeof value === 'string' && value.trim() !== '') ||
      (Array.isArray(value) && value.length > 0)
  );

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
      JSON.stringify(searchParams), // 🔥 Pastikan perubahan di object terdeteksi
      status,
      categoryType,
    ],
    queryFn: async () => {
      if (!isValidRequest) {
        throw new Error('Invalid request: company_id or module_id missing');
      }

      // 🔥 Filter hanya parameter yang memiliki nilai valid (tidak undefined/null/kosong)
      const filteredParams: Record<string, any> = Object.fromEntries(
        Object.entries({ page, limit, ...searchParams }).filter(
          ([_, value]: [string, any]) => {
            if (typeof value === 'string') return value.trim() !== ''; // String tidak boleh kosong
            if (Array.isArray(value)) return value.length > 0; // Array tidak boleh kosong
            return value !== null && value !== undefined; // Nilai lain harus valid
          }
        )
      );

      if (status.length > 0) {
        filteredParams.status = status.join(','); // ✅ Format string: "ACTIVE,INACTIVE"
      }

      if (categoryType.length > 0) {
        filteredParams.categoryType = categoryType.join(','); // ✅ Format string: "TYPE1,TYPE2"
      }

      // 🔥 Debugging
      console.log('🔥 Fetching Categories with Params:', filteredParams);

      const url = hasSearchParams
        ? `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-categories/search`
        : `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/get-categories`;

      console.log('🔥 Fetching Categories with Params:', filteredParams);

      // 🔥 Fetch data berdasarkan kondisi
      const response = await api.get<CategoryResponse>(url, {
        params: filteredParams,
      });

      return response.data;
    },
    enabled: isValidRequest, // ✅ Hanya fetch jika request valid
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

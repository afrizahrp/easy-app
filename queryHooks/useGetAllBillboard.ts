import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore, useModuleStore } from '@/store';
import { Billboard } from '@/types';

interface BillboardResponse {
  data: Billboard[];
  totalRecords: number;
}

export const useGetAllBillboard = (page: number, limit: number) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/billboards/all`;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    BillboardResponse,
    Error
  >({
    queryKey: ['billboards', company_id, page, limit],
    queryFn: async () => {
      try {
        const response = await api.get<BillboardResponse>(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching billboard:', error);
        throw new Error('Failed to fetch billboard');
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

export default useGetAllBillboard;

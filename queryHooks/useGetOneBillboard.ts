import { api } from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore } from '@/store';
import { useModuleStore } from '@/store';
import { Billboard } from '@/types';

export const useGetOneBillboard = (id: string) => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/billboards/${id}`;

  const { data, isLoading, error, isFetching, ...rest } = useQuery<
    Billboard,
    Error
  >({
    queryKey: ['billboard', id],
    queryFn: async () => {
      const response = await api.get<Billboard>(url);
      return response.data;
    },
  });
  ({
    queryKey: ['billboard', id],
    queryFn: async () => {
      try {
        const response = await api.get<Billboard>(url);

        return response.data;
      } catch (error) {
        console.error('Error fetching billboard:', error);
        throw new Error('Failed to fetch billboard');
      }
    },
    staleTime: 60 * 1000, // 60s
    retry: 3,
    placeholderData: (previousData: Billboard | undefined) =>
      previousData ?? undefined,
  });

  return {
    data,
    isLoading,
    isFetching,
    error,
    ...rest,
  };
};

export default useGetOneBillboard;

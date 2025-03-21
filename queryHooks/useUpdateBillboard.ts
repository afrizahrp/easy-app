import { api } from '@/config/axios.config';
import { useSessionStore } from '@/store';
import { useModuleStore } from '@/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Billboard } from '@/types';

interface UpdateBillboardData {
  id: number;
  data: Billboard;
}

export const useUpdateBillboard = () => {
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/billboards`;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateBillboardData) => {
      try {
        const response = await api.patch(`${url}/${data.id}`, data.data);
        return response.data;
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error('Failed to update billboard');
        }
      }
    },
    onSuccess: () => {
      if (company_id) {
        queryClient.invalidateQueries({
          queryKey: ['billboards'],
        });
      }
    },
  });
};

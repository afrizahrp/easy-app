import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Materials } from '@/types';

export const useMaterials = () => {
  const { data, isLoading, error, ...rest } = useQuery<Materials[], Error>({
    queryKey: ['usematerials'],
    queryFn: () =>
      axios.get('/api/inventory/materials').then((res) => res.data),

    staleTime: 60 * 1000, //60s
    retry: 3,
  });

  return { data, isLoading, error, ...rest };
};

export default useMaterials;

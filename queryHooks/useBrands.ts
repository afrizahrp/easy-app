import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Brands } from '@/types';

export const useBrands = () => {
  const { data, isLoading, error, ...rest } = useQuery<Brands[], Error>({
    queryKey: ['usebrands'],
    queryFn: () => axios.get('/api/inventory/brands').then((res) => res.data),

    staleTime: 60 * 1000, //60s
    retry: 3,
  });

  return { data, isLoading, error, ...rest };
};

export default useBrands;

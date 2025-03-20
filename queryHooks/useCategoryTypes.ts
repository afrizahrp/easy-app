import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
// import { CategoryTypes } from '@/types';

interface CategoryTypes {
  id: string;
  name: string;
}

export const useCategoryTypes = () => {
  const { data, isLoading, error, ...rest } = useQuery<CategoryTypes[], Error>({
    queryKey: ['categoryTypes'],
    queryFn: () =>
      axios.get('/api/inventory/categoryTypes').then((res) => res.data),

    staleTime: 60 * 1000, //60s
    retry: 3,
  });

  return { data, isLoading, error, ...rest };
};

export default useCategoryTypes;

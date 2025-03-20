import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface productCategories {
  id: string;
  name: string;
}
export const useProductCategories = () => {
  const { data, isLoading, error, ...rest } = useQuery<
    productCategories[],
    Error
  >({
    queryKey: ['productCategories'],
    queryFn: () =>
      axios.get('/api/inventory/productCategories', {}).then((res) => res.data),

    staleTime: 60 * 1000, //60s
    retry: 3,
  });

  return { data, isLoading, error, ...rest };
};

export default useProductCategories;

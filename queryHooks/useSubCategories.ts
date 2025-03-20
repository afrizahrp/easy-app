import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
// import { SubCategories } from '@/types';

interface SubCategories {
  category_id: string;
  id: string;
  name: string;
}

export const useSubCategories = (category_id: string) => {
  const { data, isLoading, error, ...rest } = useQuery<SubCategories[], Error>({
    queryKey: ['subcategories', category_id],
    queryFn: () =>
      axios.get('/api/inventory/subCategories', {}).then((res) => res.data),

    staleTime: 60 * 1000, //60s
    retry: 3,
  });

  const filteredData = category_id
    ? data?.filter((subCategory) => subCategory.category_id === category_id)
    : data;

  return { data: filteredData, isLoading, error, ...rest };
};

export default useSubCategories;

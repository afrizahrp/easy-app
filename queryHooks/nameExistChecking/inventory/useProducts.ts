import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Products } from '@/types';
// import { useDebounce } from 'use-debounce';

// interface products {
//   id: string;
//   name: string;
//   catalog_Id: string;
// }
export const useProducts = (searchTerms: string, searchType: string) => {
  const { data, isLoading, isError, ...rest } = useQuery<Products[], Error>({
    queryKey: ['products', searchTerms],
    queryFn: () =>
      searchTerms
        ? axios
            .get('/api/exist-name-checking/products', {
              params: {
                [searchType]: searchTerms, // use searchType as the parameter name
              },
            })
            .then((res) => res.data)
        : Promise.resolve([]), // Resolve to an empty array if name is not provided

    staleTime: 60 * 1000, //60s
    retry: 3,
    enabled: !!searchTerms && !!searchType, // Only run the query if both searchTerms and searchType are provided
  });

  return { data, isLoading, isError, ...rest };
};

export default useProducts;

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { Categories } from '@/types';

// interface Categories {
//   id: string;
//   name: string;
// }
export const useCategoryNameExist = (searchTerms: string) => {
  const [debouncedSearchTerms] = useDebounce(searchTerms, 500); // Debounce searchTerms with a 500ms delay
  const { data, isLoading, isError, ...rest } = useQuery<Categories[], Error>({
    queryKey: ['categories', debouncedSearchTerms],
    queryFn: () =>
      debouncedSearchTerms
        ? axios
            .get('/api/nameExistChecking/inventory/categories', {
              params: {
                name: debouncedSearchTerms, // use searchType as the parameter name
              },
            })
            .then((res) => res.data)
        : Promise.resolve([]), // Resolve to an empty array if name is not provided

    staleTime: 60 * 1000, //60s
    retry: 3,
    enabled: !!debouncedSearchTerms, // Only run the query if both searchTerms and searchType are provided
  });

  return { data, isLoading, isError, ...rest };
};

export default useCategoryNameExist;

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Uoms } from '@/types';

export const useUoms = (searchTerms: string, searchType: string) => {
  const {
    data: nameExist,
    isLoading,
    isError,
    ...rest
  } = useQuery<Uoms[], Error>({
    queryKey: ['uoms', searchTerms],
    queryFn: () =>
      searchTerms
        ? axios
            .get('/api/inventory/existNameChecking/uoms', {
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

  return { nameExist, isLoading, isError, ...rest };
};

export default useUoms;

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

interface customers {
  id: string;
  name: string;
}

export const useCustomers = (name: string | undefined) => {
  const [nameDebounced] = useDebounce(name?.toLocaleLowerCase(), 1000); //1second after user input
  const { data, isLoading, error, ...rest } = useQuery<customers[], Error>({
    queryKey: ['customers', nameDebounced],
    queryFn: () =>
      nameDebounced
        ? axios

            .get('/api/customers', {
              params: {
                name: nameDebounced,
                // Changed from nameDebounced to name
              },
            })
            .then((res) => res.data)
        : Promise.resolve([]), // Resolve to an empty array if name is not provided

    staleTime: 60 * 1000, //60s
    retry: 3,
    enabled: !!nameDebounced, // The query will not run if nameDebounced is falsy
  });

  return { data, isLoading, error, ...rest };
};

export default useCustomers;

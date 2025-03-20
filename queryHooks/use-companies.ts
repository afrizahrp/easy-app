import { useQuery } from '@tanstack/react-query';

interface Companies {
  id: string;
  name: string;
}

const useCompanies = () => {
  const { data, isLoading, error, ...rest } = useQuery<Companies[], Error>({
    queryKey: ['companies'],
    queryFn: () =>
      fetch('api/Companies')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => data),
    staleTime: 60 * 1000, //60s
    retry: 3,
  });

  return { data, isLoading, error, ...rest };
};

export default useCompanies;

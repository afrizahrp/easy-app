import { useQuery } from '@tanstack/react-query';

interface Branches {
  id: string;
  name: string;
}

const useBranches = () => {
  const { data, isLoading, error, ...rest } = useQuery<Branches[], Error>({
    queryKey: ['branches'],
    queryFn: () =>
      fetch('api/Branches')
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

export default useBranches;

import { useQuery } from '@tanstack/react-query';

type UserRoles = {
  id: string;
  name: string;
  description: string;
};

export const useUserRoles = () => {
  const { data, isLoading, error, ...rest } = useQuery<UserRoles[], Error>({
    queryKey: ['userRoles'],
    queryFn: () =>
      fetch('/api/UserRole')
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

export default useUserRoles;

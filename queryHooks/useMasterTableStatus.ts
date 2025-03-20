import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface masterTableStatus {
  id: string;
  name: string;
}
export const useMasterTableStatus = () => {
  const { data, isLoading, error, ...rest } = useQuery<
    masterTableStatus[],
    Error
  >({
    queryKey: ['masterTableStatus'],
    queryFn: () =>
      axios.get('/api/system/masterTableStatus').then((res) => res.data),

    staleTime: 60 * 1000, //60s
    retry: 3,
  });

  return { data, isLoading, error, ...rest };
};

export default useMasterTableStatus;

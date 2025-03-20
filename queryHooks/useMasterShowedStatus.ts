import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface masterShowedStatus {
  id: string;
  name: string;
}
export const useMasterShowedStatus = () => {
  const { data, isLoading, error, ...rest } = useQuery<
    masterShowedStatus[],
    Error
  >({
    queryKey: ['masterShowedStatus'],
    queryFn: () =>
      axios.get('/api/system/masterShowedStatus').then((res) => res.data),

    staleTime: 60 * 1000, //60s
    retry: 3,
  });

  return { data, isLoading, error, ...rest };
};

export default useMasterShowedStatus;

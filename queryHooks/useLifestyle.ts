import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

interface lifestyle {
  id: string
  name: string
}
export const useLifestyle = () => {
  const { data, isLoading, error, ...rest } = useQuery<lifestyle[], Error>({
    queryKey: ['lifestyle'],
    queryFn: () => axios.get('/api/cms/lifestyle').then(res => res.data),

    staleTime: 60 * 1000, //60s
    retry: 3
  })

  return { data, isLoading, error, ...rest }
}

export default useLifestyle

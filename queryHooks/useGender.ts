import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

interface gender {
  id: string
  name: string
}
export const useGender = () => {
  const { data, isLoading, error, ...rest } = useQuery<gender[], Error>({
    queryKey: ['gender'],
    queryFn: () => axios.get('/api/cms/gender').then(res => res.data),

    staleTime: 60 * 1000, //60s
    retry: 3
  })

  return { data, isLoading, error, ...rest }
}

export default useGender

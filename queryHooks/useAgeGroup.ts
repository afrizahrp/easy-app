import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

interface agegroup {
  id: string
  name: string
}
export const useAgeGroup = () => {
  const { data, isLoading, error, ...rest } = useQuery<agegroup[], Error>({
    queryKey: ['agegroup'],
    queryFn: () => axios.get('/api/cms/agegroup').then(res => res.data),

    staleTime: 60 * 1000, //60s
    retry: 3
  })

  return { data, isLoading, error, ...rest }
}

export default useAgeGroup

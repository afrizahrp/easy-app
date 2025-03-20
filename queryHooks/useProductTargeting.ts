import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export interface ProductTargeting {
  id: string
  product_id: string
  target_agegroup_id: string
  target_gender_id: string[]
  target_lifestyle_id: string[]
}

export const useProductTargeting = () => {
  const { data, isLoading, error, ...rest } = useQuery<ProductTargeting[], Error>({
    queryKey: ['productTargeting'],
    queryFn: () => axios.get('/api/cms/product-targeting').then(res => res.data),
    staleTime: 60 * 1000, // 60s
    retry: 3
  })

  return { data, isLoading, error, ...rest }
}

export default useProductTargeting

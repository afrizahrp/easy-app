import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface NewProductTargeting {
  product_id?: string
  target_agegroup_id?: string
  // target_gender_id?: string
  // target_lifestyle_id?: string
}

export const useAddProductTargeting = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<any, Error, NewProductTargeting>(
    async (newProductTargeting: NewProductTargeting) => {
      try {
        // Log data sebelum mengirim ke server
        // console.log('Sending data to endpoint:', newProductTargeting)

        const response = await axios.post('/api/cms/product-targeting', newProductTargeting)

        // Log respons setelah server merespons
        // console.log('Response from server:', response.data)

        return response.data
      } catch (err) {
        console.error('Error during request:', err)
        throw err
      }
    },
    {
      onSuccess: () => {
        // Log ketika request berhasil
        console.log('Product targeting saved successfully')
        queryClient.invalidateQueries({ queryKey: ['productTargeting'] })
      },
      onError: error => {
        // Log jika terjadi error
        console.error('Error during mutation:', error)
      }
    }
  )

  return {
    ...mutation,
    isLoading: mutation.isLoading // Tambahkan properti isLoading agar tersedia
  }
}

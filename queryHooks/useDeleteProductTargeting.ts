import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface DeleteProductTargetingParams {
  productId?: string
  ageGroupId?: string
}

export const useDeletePreviousTargetingData = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<any, Error, DeleteProductTargetingParams>(
    async ({ productId, ageGroupId }: DeleteProductTargetingParams) => {
      try {
        // Log data before sending to server
        // console.log('Deleting product targeting for productId:', productId)

        // const response = await axios.delete(`/api/cms/product-targeting/${productId}`)
        const response = await axios.delete(`/api/cms/product-targeting/${productId}/${ageGroupId}`)

        // Log response after server responds
        // console.log('Delete response from server:', response.data)

        return response.data
      } catch (err) {
        console.error('Error during delete request:', err)
        throw err
      }
    },
    {
      onSuccess: () => {
        console.log('Previous product targeting deleted successfully')
        queryClient.invalidateQueries({ queryKey: ['productTargeting'] }) // Refresh data after deletion
      },
      onError: error => {
        console.error('Error during delete mutation:', error)
      }
    }
  )

  return {
    ...mutation,
    isLoading: mutation.isLoading // Expose isLoading for UI handling
  }
}

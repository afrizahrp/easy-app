import { z } from 'zod'

export const brandFormSchema = z.object({
  id: z.string().min(3).or(z.literal('')).optional(),
  name: z.string().min(2, { message: 'brand name is required' }), // {message: 'Name must be at least 5 characters long'
  remarks: z.string().min(5).or(z.literal('')).optional(),
  iStatus: z.boolean().default(true)
})

export type BrandFormValues = z.infer<typeof brandFormSchema>

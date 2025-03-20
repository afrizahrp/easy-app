import { sub } from 'date-fns'
import { z } from 'zod'

export const productFormSchema = z.object({
  // images: z.object({ imageURL: z.string() }).array(),
  images: z.object({ imageURL: z.string() }).array().optional(),
  id: z.string().min(5).or(z.literal('')),
  name: z.string().min(5, { message: 'Product name is required' }), // {message: 'Name must be at least 5 characters long'
  category_id: z.string().min(3, { message: 'Category is required' }),
  subCategory_id: z.string().min(3, { message: 'Subcategory is required' }),
  brand_id: z.string().min(3, { message: 'Brand is required' }),
  qty: z.number().int().positive().nullable().optional(), // Mengizinkan null atau tidak diisi
  sellingPrice: z.number().int().positive().nullable().optional(), // Mengizinkan null atau tidak diisi
  uom_id: z.string().optional().nullable(),
  isMaterial: z.boolean().default(false),
  iStatus: z.boolean().default(true),
  slug: z.string().min(5).or(z.literal('')),
  iShowedStatus: z.boolean().optional().nullable()
})

export type ProductFormValues = z.infer<typeof productFormSchema>

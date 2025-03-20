import { z } from 'zod';

export const materialproductFormSchema = z.object({
  catalog_id: z.string().min(5).or(z.literal('')),
  registered_id: z.string().min(5).or(z.literal('')).optional(),
  ecatalog_URL: z.string().min(5).or(z.literal('')).optional(),
  id: z.string().min(5).or(z.literal('')).optional(),
  name: z.string().min(5, { message: 'Material name is required' }), // {message: 'Name must be at least 5 characters long'
  category_id: z.string().min(3, { message: 'Category is required' }),
  subCategory_id: z.string().min(5).or(z.literal('')).nullable(),
  uom_id: z.string().min(5).or(z.literal('')).nullable(),
  brand_id: z.string().min(5).or(z.literal('')).nullable(),
  iStatus: z.boolean().default(true), //iStatus False = active
  remarks: z.string().min(5).or(z.literal('')).optional(),
  isMaterial: z.boolean().default(true),
  slug: z.string().min(5).or(z.literal('')),
});

export type MaterialProductFormValues = z.infer<
  typeof materialproductFormSchema
>;

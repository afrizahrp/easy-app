import { z } from 'zod';

export const subCategoryFormSchema = z.object({
  category_id: z.string().min(3, { message: 'Category is required' }),
  id: z.string().min(3).or(z.literal('')).optional(),
  name: z.string().min(5, { message: 'subCategory name is required' }), // {message: 'Name must be at least 5 characters long'
  remarks: z.string().min(5).or(z.literal('')).optional(),
  iStatus: z.boolean().default(true),
});

export type SubCategoryFormValues = z.infer<typeof subCategoryFormSchema>;

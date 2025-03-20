import { z } from 'zod';

export const productImageFormSchema = z.object({
  id: z.string() ?? '',
  product_id: z.string() ?? '',
  imageURL: z.string().or(z.array(z.string())),
  isPrimary: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export type ProductImageFormValues = z.infer<typeof productImageFormSchema>;

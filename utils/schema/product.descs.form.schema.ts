import { z } from 'zod';

export const productDescsFormSchema = z.object({
  id: z.string(),
  descriptions: z.string().min(5).or(z.literal('')),
  // benefit: z.string().or(z.literal('')).nullable(),
});

export type ProductDescsFormValues = z.infer<typeof productDescsFormSchema>;

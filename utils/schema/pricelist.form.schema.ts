import { z } from 'zod';

export const pricelistFormSchema = z.object({
  name: z.string().min(5).or(z.literal('')),
  fileURL: z.string().min(5).or(z.literal('')),
  iStatus: z.boolean().default(true),
  iShowedStatus: z.boolean().optional().default(false),
  remarks: z.string().or(z.literal('')),
});

export type PriceListFormValues = z.infer<typeof pricelistFormSchema>;

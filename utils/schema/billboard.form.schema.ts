import { z } from 'zod';

export const billboardFormSchema = z.object({
  id: z.number().min(1).optional(),
  section: z.number().min(1).optional(),
  name: z.string().or(z.literal('')),
  isImage: z.boolean().optional(),
  contentURL: z.string().or(z.literal('')),
  content_id: z.string().or(z.literal('')),
  iShowedStatus: z.string().or(z.literal('SHOW')),
  iStatus: z.string().or(z.literal('ACTIVE')),
  remarks: z.string().or(z.literal('')),
  company_id: z.string().or(z.literal('')),
  branch_id: z.string().or(z.literal('')),
  createdBy: z.string().or(z.literal('')),
  updatedBy: z.string().or(z.literal('')),
  updatedAt: z.date(),
});

export type BillboardFormValues = z.infer<typeof billboardFormSchema>;

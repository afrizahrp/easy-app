import { z } from 'zod';

export const categoryFormSchema = z.object({
  images: z.object({ imageURL: z.string() }).array(),
  id: z.string().min(5).or(z.literal('')).optional(),
  type: z.string().min(1, { message: 'Type is required' }).optional(),
  name: z.string().min(3, { message: 'Category name is required' }), // {message: 'Name must be at least 5 characters long'
  remarks: z.string().min(5).or(z.literal('')).optional(),
  iStatus: z.boolean().default(true),
  iShowedStatus: z.boolean().default(false),
  icon: z.string().min(1).or(z.literal('')).optional(),
  href: z.string().min(1).or(z.literal('')).optional(),
  slug: z.string().min(1).or(z.literal('')).optional(),

  // createdBy: z.string().min(5).or(z.literal('')),nullable(),
  // createdAt: z.date(),
  // updatedBy: z.string().min(5).or(z.literal('')).optional().nullable(),
  // updatedAt: z.date(),
  // company: z.string().min(5).or(z.literal('')).optional().nullable(),
  // branch: z.string().min(5).or(z.literal('')).optional().nullable(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

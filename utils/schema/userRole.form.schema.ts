import { z } from 'zod';

export const userRoleFormSchema = z.object({
  id: z.string().min(3, { message: 'Role id is required' }),
  name: z.string().min(5, { message: 'Role name is required' }), // {message: 'Name must be at least 5 characters long'
  remarks: z.string().min(5).or(z.literal('')).optional(),
  iStatus: z.boolean().default(true),
});

export type UserRoleFormValues = z.infer<typeof userRoleFormSchema>;

import { z } from 'zod'

export const productTargetingFormSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  target_agegroup_id: z.string().or(z.literal('')).nullable(),
  target_gender_id: z.string().or(z.literal('')).nullable(),
  target_lifestyle_id: z.string().or(z.literal('')).nullable()
})

export type ProductTargetingFormValues = z.infer<typeof productTargetingFormSchema>

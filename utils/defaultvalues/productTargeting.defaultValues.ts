import { ProductTargetingFormValues } from '@/utils/schema/product.targeting.form.schema'

export function ProductDefaultValues(initialProductTargeting?: ProductTargetingFormValues) {
  return {
    id: initialProductTargeting?.id ?? undefined,
    product_id: initialProductTargeting?.product_id ?? '',
    target_agegroup_id: initialProductTargeting?.target_agegroup_id ?? '',
    target_gender_id: initialProductTargeting?.target_gender_id ?? '',
    target_lifestyle_id: initialProductTargeting?.target_lifestyle_id ?? ''
  }
}

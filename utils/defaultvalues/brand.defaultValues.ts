import { BrandFormValues } from '@/utils/schema/brand.form.schema'
import isEmpty from 'lodash/isEmpty'

export function defaultValues(initialData: BrandFormValues) {
  return {
    id: initialData?.id ?? '',
    name: initialData?.name ?? '',
    remarks: isEmpty(initialData?.remarks) ? initialData?.remarks : initialData?.remarks,

    iStatus: initialData?.iStatus ?? false
  }
}

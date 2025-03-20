import { CategoryFormValues } from '@/utils/schema/category.form.schema';
import isEmpty from 'lodash/isEmpty';

export function defaultValues(initialData: CategoryFormValues) {
  return {
    id: initialData?.id ?? '',
    type: isEmpty(initialData?.type) ? initialData?.type : initialData?.type,
    name: initialData?.name ?? '',
    remarks: isEmpty(initialData?.remarks)
      ? initialData?.remarks
      : initialData?.remarks,

    iStatus: initialData?.iStatus ?? false,
  };
}

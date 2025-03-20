import { UserRoleFormValues } from '@/utils/schema/userRole.form.schema';
import isEmpty from 'lodash/isEmpty';

export function defaultValues(initialData: UserRoleFormValues) {
  return {
    id: initialData?.id ?? '',
    name: initialData?.name ?? '',
    remarks: isEmpty(initialData?.remarks)
      ? initialData?.remarks
      : initialData?.remarks,

    iStatus: initialData?.iStatus ?? false,
  };
}

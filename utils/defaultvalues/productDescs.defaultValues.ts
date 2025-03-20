import { ProductDescsFormValues } from '@/utils/schema/product.descs.form.schema';

export function productdescsdefaultValues(
  initialProductDescsData?: ProductDescsFormValues
) {
  return {
    id: initialProductDescsData?.id ?? undefined,
    descriptions: initialProductDescsData?.descriptions ?? '',
    // benefit: initialProductDescsData?.benefit ?? '',
  };
}

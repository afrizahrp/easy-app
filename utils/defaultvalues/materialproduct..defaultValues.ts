import { MaterialProductFormValues } from '@/utils/schema/materialproduct.form.schema';

export function defaultValues(initialData?: MaterialProductFormValues) {
  return {
    id: initialData?.id,
    name: initialData?.name ?? '',
    catalog_id: initialData?.catalog_id || undefined,
    category_id: initialData?.category_id || undefined,
    subCategory_id: initialData?.subCategory_id || undefined,
    brand_id: initialData?.brand_id || undefined,
    uom_id: initialData?.uom_id || undefined,
    iStatus: initialData?.iStatus ?? false,
    remarks: initialData?.remarks || undefined,
    isMaterial: initialData?.isMaterial ?? true,
  };
}

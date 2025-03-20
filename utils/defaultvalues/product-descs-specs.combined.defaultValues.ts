import { ProductFormValues } from '../schema/product.form.schema';
import { ProductDescsFormValues } from '../schema/product.descs.form.schema';

export function defaultValues(
  initialProductData: ProductFormValues,
  initialProductDescsData: ProductDescsFormValues
) {
  return {
    ...initialProductData,
    images: initialProductData?.images || [],
    ...initialProductDescsData,
  };
}

import { ProductFormValues } from '@/utils/schema/product.form.schema'
import { de } from '@faker-js/faker'

export function productdefaultValues(initialProductData?: ProductFormValues) {
  return {
    images: initialProductData?.images || [],
    id: initialProductData?.id ?? '',
    name: initialProductData?.name ?? '',
    category_id: initialProductData?.category_id ?? '',
    subCategory_id: initialProductData?.subCategory_id ?? '',
    brand_id: initialProductData?.brand_id ?? '',
    qty: initialProductData?.qty ?? 0,
    sellingPrice: initialProductData?.sellingPrice ?? 0,
    uom_id: initialProductData?.uom_id ?? '',
    iStatus: initialProductData?.iStatus ?? true,
    slug: initialProductData?.slug ?? '',
    iShowedStatus: initialProductData?.iShowedStatus ?? false
  }
}

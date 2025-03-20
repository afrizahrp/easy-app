import { PriceListFormValues } from '@/utils/schema/pricelist.form.schema';

export function pricelistdefaultValues(
  initialPricelistData?: PriceListFormValues
) {
  return {
    name: initialPricelistData?.name ?? '',
    fileURL: initialPricelistData?.fileURL ?? '',
    iStatus: initialPricelistData!.iStatus ?? true,
    iShowedStatus: initialPricelistData!.iShowedStatus ?? false,
    remarks: initialPricelistData?.remarks ?? '',
  };
}

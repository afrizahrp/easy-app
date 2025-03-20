import { BillboardURLSFormValues } from '@/utils/schema/billboardContents.form.schema';

export function billboardURLSdefaultValues(
  initialBillboardURLSData?: BillboardURLSFormValues
) {
  return {
    id: initialBillboardURLSData?.id ?? '',
    contentURL: initialBillboardURLSData?.contentURL || [],
    billboard_id: initialBillboardURLSData?.billboard_id ?? '',
    isPrimary: initialBillboardURLSData?.isPrimary ?? false,
  };
}

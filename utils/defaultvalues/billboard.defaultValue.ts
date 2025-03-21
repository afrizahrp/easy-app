import { BillboardFormValues } from '@/utils/schema/billboard.form.schema';

export function billboarddefaultValues(
  initialBillboardData?: BillboardFormValues
) {
  return {
    ...(initialBillboardData ?? {}), // Spread data, agar id tidak ter-set 0
    section: initialBillboardData?.section ?? 0,
    name: initialBillboardData?.name ?? '',
    isImage: initialBillboardData?.isImage,
    contentURL: initialBillboardData?.contentURL ?? '',
    content_id: initialBillboardData?.content_id ?? '',
    iStatus: initialBillboardData?.iStatus ?? 'ACTIVE',
    iShowedStatus: initialBillboardData?.iShowedStatus ?? 'SHOW',
    remarks: initialBillboardData?.remarks ?? '',
    company_id: initialBillboardData?.company_id ?? '',
    branch_id: initialBillboardData?.branch_id ?? '',
    createdBy: initialBillboardData?.createdBy ?? '',
    updatedBy: initialBillboardData?.updatedBy ?? '',
    updatedAt: initialBillboardData?.updatedAt ?? new Date(),
    // createdAt: initialBillboardData?.createdAt ?? new Date(),
  };
}

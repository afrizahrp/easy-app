// components/HeaderPeriodFilterSection.tsx
'use client';

import { PeriodFilter } from '@/components/period-filter';
interface HeaderPeriodFilterSectionProps {
  onPeriodChange?: (period: {
    startPeriod: Date | null;
    endPeriod: Date | null;
  }) => void;
}

export function HeaderPeriodFilterSection({
  onPeriodChange,
}: HeaderPeriodFilterSectionProps) {
  console.log('HeaderPeriodFilterSection rendered');
  return (
    <div className='w-full'>
      <PeriodFilter onPeriodChange={onPeriodChange} />
    </div>
  );
}

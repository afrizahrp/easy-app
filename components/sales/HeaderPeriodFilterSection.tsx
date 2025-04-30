// components/HeaderPeriodFilterSection.tsx
'use client';

import { HeaderFilterSection } from '@/components/header-filter-section';
import { PeriodFilter } from '@/components/period-filter';

interface HeaderPeriodFilterSectionProps {
  onPeriodChange?: () => void;
  className?: string;
}

export function HeaderPeriodFilterSection({
  onPeriodChange,
  className = '',
}: HeaderPeriodFilterSectionProps) {
  return (
    <HeaderFilterSection className={className}>
      <PeriodFilter onPeriodChange={onPeriodChange} />
    </HeaderFilterSection>
  );
}

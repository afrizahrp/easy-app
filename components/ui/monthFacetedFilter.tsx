'use client';

import { FacetedFilter } from '@/components/ui/facetedFilter';
import { months } from '@/utils/monthNameMap';
import { useToast } from '@/components/ui/use-toast';

interface MonthFacetedFilterProps {
  title?: string;
  options?: { value: string; label: string; count?: number }[];
  isLoading?: boolean;
  disabled?: boolean;
  selectedValues: Set<string>;
  onSelect: (value: string) => void;
  ariaLabel?: string;
}

export function MonthFacetedFilter({
  title = 'Month',
  options = months.map((month) => ({
    value: month.toLowerCase(),
    label: month,
  })),
  isLoading,
  disabled,
  selectedValues,
  onSelect,
  ariaLabel,
}: MonthFacetedFilterProps) {
  const { toast } = useToast();

  const handleSelect = (value: string) => {
    if (selectedValues.size > 5 && !selectedValues.has(value)) {
      toast({
        description: 'Maximum 6 months can be selected.',
        variant: 'destructive',
      });
      return;
    }
    onSelect(value);
  };

  return (
    <FacetedFilter
      title={title}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      selectedValues={selectedValues}
      onSelect={handleSelect}
      ariaLabel={ariaLabel}
    />
  );
}

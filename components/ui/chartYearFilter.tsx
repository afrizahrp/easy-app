'use client';

import * as React from 'react';
import { Years } from '@/utils/getYears';
import { useYearlyPeriodStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import { YearFacetedFilter } from '@/components/ui/yearFacetedFilter';

interface ChartYearFilterProps {
  title?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ChartYearFilter({
  title = 'Filter by Year',
  isLoading,
  disabled,
  className,
}: ChartYearFilterProps) {
  const { selectedYears, setYears, resetYears } = useYearlyPeriodStore();
  const { toast } = useToast();

  const yearOptions = React.useMemo(
    () =>
      Years.sort((a, b) => Number(b) - Number(a)).map((year) => ({
        value: year,
        label: year,
      })),
    []
  );

  if (!yearOptions.length) {
    return (
      <div className='text-center text-sm text-slate-500'>
        No years available
      </div>
    );
  }

  const handleSelect = (value: string) => {
    const updatedYears = new Set(selectedYears);
    if (value) {
      updatedYears.has(value)
        ? updatedYears.delete(value)
        : updatedYears.add(value);
    } else {
      updatedYears.clear();
    }
    setYears(Array.from(updatedYears));
  };

  const handleReset = () => {
    try {
      resetYears();
      toast({
        description: 'Year filter has been reset.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        description: `Reset failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`flex flex-col space-y-4 w-full py-2 ${className || ''}`}>
      <div>
        <h3 className='text-lg font-semibold mb-2 text-center'>{title}</h3>
        <YearFacetedFilter
          title='Year'
          options={yearOptions}
          isLoading={isLoading}
          disabled={disabled}
          selectedValues={new Set(selectedYears)}
          onSelect={handleSelect}
          ariaLabel='dashboard year filter'
        />
      </div>

      <Button
        variant='outline'
        onClick={handleReset}
        className='h-10 px-2 w-full mb-5 bg-secondary text-slate hover:bg-secondary-dark dark:bg-secondary dark:text-slate-100 dark:hover:bg-secondary dark:hover:text-slate-400'
        aria-label='Reset dashboard year filter'
      >
        <Cross2Icon className='ml-2 h-4 w-4' />
        Reset Year
      </Button>
    </div>
  );
}

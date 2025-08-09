'use client';
import * as React from 'react';
import { Years } from '@/lib/utils';
import { useYearlyPeriodStore, useMonthlyPeriodStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import { FacetedFilter } from '@/components/ui/facetedFilter';
import { MonthFacetedFilter } from '@/components/ui/monthFacetedFilter';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { months } from '@/utils/monthNameMap';
import CompanyFacetedFilter from '@/components/ui/companyFacetedFilter';

interface ChartYearFilterProps {
  title?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

interface YearOption {
  value: string;
  label: string;
}

interface YearPeriodStore {
  selectedYears: string[];
  setYears: (years: string[]) => void;
  resetYears: () => void;
}

interface MonthPeriodStore {
  selectedMonths: string[];
  setMonths: (months: string[]) => void;
  resetMonths: () => void;
}

export function ChartYearFilter({
  title = '',
  isLoading,
  disabled,
  className,
  'aria-label': ariaLabel = 'Filter by year or month',
}: ChartYearFilterProps) {
  const { selectedYears, setYears, resetYears } =
    useYearlyPeriodStore() as YearPeriodStore;
  const { selectedMonths, setMonths, resetMonths } =
    useMonthlyPeriodStore() as MonthPeriodStore;
  const { toast } = useToast();

  const yearOptions = React.useMemo<YearOption[]>(
    () =>
      Years.sort((a, b) => Number(b) - Number(a)).map((year) => ({
        value: year,
        label: year,
      })),
    []
  );

  const handleYearSelect = (value: string) => {
    const updatedYears = new Set(selectedYears);
    if (value) {
      if (updatedYears.has(value)) {
        updatedYears.delete(value);
      } else {
        updatedYears.add(value);
      }
      setYears(Array.from(updatedYears));
    } else {
      resetYears();
    }
  };

  const handleMonthSelect = (value: string) => {
    const updatedMonths = new Set(selectedMonths);
    if (value === 'all') {
      if (!updatedMonths.has('all')) {
        setMonths(['all']);
      } else {
        resetMonths();
      }
    } else if (value) {
      if (updatedMonths.has('all')) {
        updatedMonths.delete('all');
      }
      if (updatedMonths.has(value)) {
        updatedMonths.delete(value);
      } else {
        updatedMonths.add(value);
      }
      setMonths(Array.from(updatedMonths));
    } else {
      resetMonths();
    }
  };

  const handleReset = React.useCallback(() => {
    try {
      resetYears();
      resetMonths();
      toast({
        description: 'Year and month filters have been reset.',
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
  }, [resetYears, resetMonths, toast]);

  const hasActiveFilters =
    selectedYears.length > 0 || selectedMonths.length > 0;

  if (!yearOptions.length) {
    return (
      <motion.div
        className='text-center text-sm text-gray-500 dark:text-gray-400'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        No years available
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn('flex flex-col space-y-3 w-full py-2', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div>
        <h3 className='text-lg font-semibold mb-3 text-center text-gray-800 dark:text-gray-200'>
          {title}
        </h3>

        {/* Company Filter dengan spacing */}
        <div className='mb-3'>
          <CompanyFacetedFilter />
        </div>

        {/* Year Filter dengan spacing */}
        <div className='mb-3'>
          <FacetedFilter
            title='Year'
            options={yearOptions}
            isLoading={isLoading}
            disabled={disabled}
            selectedValues={new Set(selectedYears)}
            onSelect={handleYearSelect}
            ariaLabel={`${ariaLabel} - Year`}
          />
        </div>

        {/* Month Filter dengan spacing */}
        <div className='mb-3'>
          <MonthFacetedFilter
            title='Month'
            options={[
              ...months.map((month) => ({
                value: month.toLowerCase(),
                label: month,
              })),
            ]}
            isLoading={isLoading}
            disabled={disabled}
            selectedValues={new Set(selectedMonths)}
            onSelect={handleMonthSelect}
            ariaLabel={`${ariaLabel} - Month`}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant='outline'
            onClick={handleReset}
            className={cn(
              'h-10 px-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-label='Reset year and month filter'
            disabled={disabled}
          >
            <Cross2Icon className='ml-2 h-4 w-4' />
            Reset Filter
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

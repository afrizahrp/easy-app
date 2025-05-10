'use client';
import { useYearlyPeriodStore } from '@/store';
import { FilterSummary } from '@/components/filterSummary';
import clsx from 'clsx';

interface ChartYearFilterSummaryProps {
  className?: string;
}

export default function ChartYearFilterSummary({
  className = '',
}: ChartYearFilterSummaryProps) {
  const { selectedYears, setYears, resetYears } = useYearlyPeriodStore();

  const getDefaultYears = (): string[] => {
    const currentYear = new Date().getFullYear();
    return [`${currentYear - 1}`, `${currentYear}`]; // Misalnya, ["2024", "2025"]
  };

  const defaultYears = getDefaultYears();
  const defaultYear = defaultYears.join(', ');

  const handleClear = (year: string) => {
    const updatedYears = new Set(selectedYears);
    updatedYears.delete(year);
    setYears(Array.from(updatedYears));
  };

  // Cek apakah ada tahun non-default
  const hasNonDefaultYears = selectedYears.some(
    (year) => !defaultYears.includes(year)
  );

  // Satu entri untuk Selected Years, dengan array tahun sebagai value
  const filtersList = [
    {
      label: 'Selected Years',
      value: selectedYears.length > 0 ? selectedYears.sort() : defaultYears,
      isClearable: selectedYears.length > 0 && hasNonDefaultYears,
      onClear: () => resetYears(),
      individualYears: hasNonDefaultYears
        ? selectedYears.filter((year) => !defaultYears.includes(year))
        : [],
      onClearIndividual: handleClear,
    },
  ];

  // Log untuk debugging
  console.log('ChartYearFilterSummary Render:', {
    selectedYears,
    hasNonDefaultYears,
    filtersList,
  });

  return (
    <div
      className={clsx(
        'w-full flex items-center bg-secondary text-primary dark:text-slate-400 px-2 py-2 rounded-md shadow-sm',
        className
      )}
    >
      <div className='w-full flex justify-center'>
        <FilterSummary
          layout='inline'
          filters={filtersList}
          className='text-slate-700 dark:text-slate-400 text-lg'
        />
      </div>
    </div>
  );
}

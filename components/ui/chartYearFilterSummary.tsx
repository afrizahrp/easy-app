'use client';
import {
  useYearlyPeriodStore,
  useCompanyFilterStore,
  useMonthlyPeriodStore,
} from '@/store';
import { DashboardFilterSummary } from '@/components/dashboardFilterSummary';
import { getDefaultYears } from '@/lib/utils';
import clsx from 'clsx';

interface ChartYearFilterSummaryProps {
  className?: string;
}

export default function ChartYearFilterSummary({
  className = '',
}: ChartYearFilterSummaryProps) {
  const { selectedYears, setYears, resetYears } = useYearlyPeriodStore();
  const { selectedCompanyIds } = useCompanyFilterStore();
  const { selectedMonths } = useMonthlyPeriodStore();

  const defaultYears = getDefaultYears();

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
      label: 'Selected Companies',
      value: selectedCompanyIds.length > 0 ? selectedCompanyIds : ['BIS'],
      isClearable: selectedCompanyIds.length > 0,
      onClear: () => useCompanyFilterStore.getState().setSelectedCompanyIds([]),
      individualYears: selectedCompanyIds,
      onClearIndividual: (id: string) =>
        useCompanyFilterStore
          .getState()
          .setSelectedCompanyIds(selectedCompanyIds.filter((c) => c !== id)),
    },
    {
      label: 'Selected Months',
      value: selectedMonths.length > 0 ? selectedMonths : [],
      isClearable: selectedMonths.length > 0,
      onClear: () => useMonthlyPeriodStore.getState().resetMonths(),
      individualYears: selectedMonths,
      onClearIndividual: (month: string) =>
        useMonthlyPeriodStore
          .getState()
          .setMonths(selectedMonths.filter((m) => m !== month)),
    },
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
        <DashboardFilterSummary
          layout='inline'
          filters={filtersList}
          className='text-slate-700 dark:text-slate-400 text-lg'
        />
      </div>
    </div>
  );
}

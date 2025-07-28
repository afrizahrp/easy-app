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

  // Fungsi untuk mengecek apakah bulan berurutan dan mengembalikan format teks
  const getFormattedMonths = (months: string[]) => {
    if (months.length === 0) return [];

    // Urutkan bulan berdasarkan urutan kalender
    const monthOrder = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const sortedMonths = months.sort(
      (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
    );

    // Cek apakah bulan berurutan
    let isConsecutive = true;
    for (let i = 1; i < sortedMonths.length; i++) {
      if (
        monthOrder.indexOf(sortedMonths[i]) !==
        monthOrder.indexOf(sortedMonths[i - 1]) + 1
      ) {
        isConsecutive = false;
        break;
      }
    }

    if (isConsecutive && sortedMonths.length > 1) {
      // Format untuk bulan berurutan: "As At [last month]"
      return [`As At ${sortedMonths[sortedMonths.length - 1]}`];
    } else {
      // Format untuk bulan tidak berurutan: "Jan, Mar, and Apr"
      if (sortedMonths.length === 1) return sortedMonths;
      if (sortedMonths.length === 2)
        return [`${sortedMonths[0]} and ${sortedMonths[1]}`];
      return [
        `${sortedMonths.slice(0, -1).join(', ')}, and ${sortedMonths[sortedMonths.length - 1]}`,
      ];
    }
  };

  // Definisikan filtersList dengan urutan: Company, Year, Month
  const filtersList = [
    {
      label: 'Companies',
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
      label: 'Years',
      value: selectedYears.length > 0 ? selectedYears.sort() : defaultYears,
      isClearable: selectedYears.length > 0 && hasNonDefaultYears,
      onClear: () => resetYears(),
      individualYears: hasNonDefaultYears
        ? selectedYears.filter((year) => !defaultYears.includes(year))
        : [],
      onClearIndividual: handleClear,
    },
    ...(selectedMonths.length > 0
      ? [
          {
            label: 'Months',
            value: getFormattedMonths(selectedMonths),
            isClearable: selectedMonths.length > 0,
            onClear: () => useMonthlyPeriodStore.getState().resetMonths(),
            individualYears: selectedMonths, // Untuk penghapusan individual
            onClearIndividual: (month: string) =>
              useMonthlyPeriodStore
                .getState()
                .setMonths(selectedMonths.filter((m) => m !== month)),
          },
        ]
      : []),
  ];

  // Log untuk debugging
  console.log('ChartYearFilterSummary Render:', {
    selectedYears,
    hasNonDefaultYears,
    selectedMonths,
    formattedMonths: getFormattedMonths(selectedMonths),
    filtersList,
  });

  return (
    <div
      className={clsx(
        'w-full bg-secondary text-primary dark:text-slate-400 px-2 py-2 rounded-md shadow-sm flex justify-center',
        className
      )}
    >
      <div className='w-full max-w-md'>
        <DashboardFilterSummary
          layout='grid'
          filters={filtersList}
          className='text-slate-700 dark:text-slate-400 text-lg flex flex-col gap-2 text-center'
        />
      </div>
    </div>
  );
}

'use client';
import {
  useYearlyPeriodStore,
  useCompanyFilterStore,
  useMonthlyPeriodStore,
} from '@/store';
import { DashboardFilterSummary } from '@/components/dashboardFilterSummary';
import { getDefaultYears } from '@/lib/utils';
import { months } from '@/utils/monthNameMap';
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
  // ...existing code...
  const getFormattedMonths = (selectedMonths: string[]): string => {
    if (selectedMonths.length === 0) return '';
    const monthOrder = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];
    const monthNames: { [key: string]: string } = {
      jan: months[0],
      feb: months[1],
      mar: months[2],
      apr: months[3],
      may: months[4],
      jun: months[5],
      jul: months[6],
      aug: months[7],
      sep: months[8],
      oct: months[9],
      nov: months[10],
      dec: months[11],
    };

    // Mengubah input menjadi huruf kecil untuk sorting
    const lowerSorted = [...selectedMonths]
      .map((m) => m.slice(0, 3).toLowerCase())
      .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

    // Mapping ke nama lengkap
    const sortedMonths = lowerSorted.map((m) => monthNames[m]);
    // Cek apakah bulan berurutan berdasarkan versi lowercase
    let isConsecutive = true;
    for (let i = 1; i < lowerSorted.length; i++) {
      if (
        monthOrder.indexOf(lowerSorted[i]) !==
        monthOrder.indexOf(lowerSorted[i - 1]) + 1
      ) {
        isConsecutive = false;
        break;
      }
    }

    let formatted: string;
    if (isConsecutive && sortedMonths.length > 1) {
      // Contoh: "As At April"
      formatted = `As At ${sortedMonths[sortedMonths.length - 1]}`;
    } else {
      if (sortedMonths.length === 1) {
        formatted = sortedMonths[0];
      } else if (sortedMonths.length === 2) {
        formatted = `${sortedMonths[0]} and ${sortedMonths[1]}`;
      } else {
        formatted = `${sortedMonths.slice(0, -1).join(', ')}, and ${sortedMonths[sortedMonths.length - 1]}`;
      }
    }
    return formatted;
  };
  // ...existing code...

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
  // console.log('ChartYearFilterSummary Render:', {
  //   selectedYears,
  //   hasNonDefaultYears,
  //   selectedMonths,
  //   formattedMonths: getFormattedMonths(selectedMonths),
  //   filtersList,
  // });

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

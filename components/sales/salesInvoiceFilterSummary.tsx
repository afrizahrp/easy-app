// components/Sls_InvoiceFilterSummary.tsx
'use client';
import { useMonthYearPeriodStore, useSalesInvoiceHdFilterStore } from '@/store';
import { FilterSummary } from '@/components/filterSummary';
import { format } from 'date-fns';

interface SalesInvoiceFilterSummaryProps {
  className?: string;
}

export default function SalesInvoiceFilterSummary({
  className = '',
}: SalesInvoiceFilterSummaryProps) {
  const { startPeriod, endPeriod, setStartPeriod, setEndPeriod } =
    useMonthYearPeriodStore();
  const {
    paidStatus,
    poType,
    salesPersonName,
    setPaidStatus,
    setPoType,
    setSalesPersonName,
  } = useSalesInvoiceHdFilterStore();

  // Fungsi untuk clear filter
  const handleClear = (filterName: string) => {
    switch (filterName) {
      case 'startPeriod':
        setStartPeriod(null);
        break;
      case 'endPeriod':
        setEndPeriod(null);
        break;
      case 'paidStatus':
        setPaidStatus([]);
        break;
      case 'poType':
        setPoType([]);
        break;
      case 'salesPersonName':
        setSalesPersonName([]);
        break;
      default:
        break;
    }
  };

  // Susun filter, hanya tampilkan yang punya nilai (kecuali Periode)
  const filters = [
    {
      label: 'Invoice Period',
      value:
        startPeriod && endPeriod
          ? `${format(startPeriod, 'MMM yyyy')} - ${format(endPeriod, 'MMM yyyy')}`
          : startPeriod
            ? format(startPeriod, 'MMM yyyy')
            : 'Jan 2025 - Apr 2025', // Default periode
      isClearable: false,
    },
    ...(salesPersonName.length > 0
      ? [
          {
            label: 'Sales Person',
            value: salesPersonName,
            isClearable: true,
            onClear: () => handleClear('salesPersonName'),
          },
        ]
      : []),
    ...(paidStatus.length > 0
      ? [
          {
            label: 'Paid Status',
            value: paidStatus,
            isClearable: true,
            onClear: () => handleClear('paidStatus'),
          },
        ]
      : []),
    ...(poType.length > 0
      ? [
          {
            label: 'PO Type',
            value: poType,
            isClearable: true,
            onClear: () => handleClear('poType'),
          },
        ]
      : []),
  ];

  return (
    <div
      className={`w-full border-t mt-4 pt-4 flex items-center bg-secondary text-primary dark:text-slate-400 px-4 py-3 rounded-md shadow-sm ${className}`}
    >
      <div className='w-full flex justify-center font-semibold text-md'>
        <FilterSummary
          layout='inline'
          filters={filters}
          className='text-slate-700 dark:text-slate-400 text-lg'
        />
      </div>
    </div>
  );
}

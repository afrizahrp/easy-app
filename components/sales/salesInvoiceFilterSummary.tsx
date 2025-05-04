'use client';
import { useMonthYearPeriodStore, useSalesInvoiceHdFilterStore } from '@/store';
import { FilterSummary } from '@/components/filterSummary';
import { format } from 'date-fns';

interface SalesInvoiceFilterSummaryProps {
  className?: string;
  context: 'salesInvoice' | 'salesPersonInvoice';
}

export default function SalesInvoiceFilterSummary({
  className = '',
  context,
}: SalesInvoiceFilterSummaryProps) {
  const {
    salesInvoicePeriod,
    setSalesInvoicePeriod,
    salesPersonInvoicePeriod,
    setSalesPersonInvoicePeriod,
  } = useMonthYearPeriodStore();
  const {
    salesInvoiceFilters,
    setSalesInvoiceFilters,
    salesPersonInvoiceFilters,
    setSalesPersonInvoiceFilters,
  } = useSalesInvoiceHdFilterStore();

  const period =
    context === 'salesInvoice' ? salesInvoicePeriod : salesPersonInvoicePeriod;
  const setPeriod =
    context === 'salesInvoice'
      ? setSalesInvoicePeriod
      : setSalesPersonInvoicePeriod;
  const filters =
    context === 'salesInvoice'
      ? salesInvoiceFilters
      : salesPersonInvoiceFilters;
  const setFilters =
    context === 'salesInvoice'
      ? setSalesInvoiceFilters
      : setSalesPersonInvoiceFilters;

  const { paidStatus, poType, salesPersonName } = filters;

  const handleClear = (filterName: string) => {
    switch (filterName) {
      case 'startPeriod':
        setPeriod({ startPeriod: null });
        break;
      case 'endPeriod':
        setPeriod({ endPeriod: null });
        break;
      case 'paidStatus':
        setFilters({ paidStatus: [] });
        break;
      case 'poType':
        setFilters({ poType: [] });
        break;
      case 'salesPersonName':
        setFilters({ salesPersonName: [] });
        break;
      default:
        break;
    }
  };

  const defaultPeriod =
    context === 'salesInvoice' ? 'Jan 2024 - Dec 2024' : 'Jan 2025 - May 2025';

  const filtersList = [
    {
      label: 'Invoice Period',
      value:
        period.startPeriod && period.endPeriod
          ? `${format(period.startPeriod, 'MMM yyyy')} - ${format(period.endPeriod, 'MMM yyyy')}`
          : period.startPeriod
            ? format(period.startPeriod, 'MMM yyyy')
            : defaultPeriod,
      isClearable: false,
      onClear: () => {
        setPeriod({ startPeriod: null, endPeriod: null });
      },
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
    ...(context === 'salesInvoice' && poType.length > 0
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
      className={`w-full flex items-center bg-secondary text-primary dark:text-slate-400 px-2 py-2 rounded-md shadow-sm ${className}`}
    >
      <div className='w-full flex justify-center font-semibold text-md'>
        <FilterSummary
          layout='inline'
          filters={filtersList}
          className='text-slate-700 dark:text-slate-400 text-lg'
        />
      </div>
    </div>
  );
}

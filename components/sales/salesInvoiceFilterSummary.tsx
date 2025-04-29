// components/Sls_InvoiceFilterSummary.tsx
'use client';
import { useState } from 'react';
import { useMonthYearPeriodStore, useSalesInvoiceHdFilterStore } from '@/store';
import { FilterSummary } from '@/components/filterSummary';
import { format } from 'date-fns';

interface SalesInvoiceFilterSummaryProps {
  className?: string; // Tambahkan prop className untuk fleksibilitas
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

  // State untuk mengontrol visibility salesDashboardPage (jika diperlukan)
  const [showSalesDashboard, setShowSalesDashboard] = useState(true);

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

  // Susun filter
  const filters = [
    {
      label: 'Invoice Period',
      value:
        startPeriod && endPeriod
          ? `${format(startPeriod, 'MMM yyyy')} - ${format(endPeriod, 'MMM yyyy')}`
          : null,
      isClearable: false,
    },
    {
      label: 'Paid Status',
      value: paidStatus,
      isClearable: true,
      onClear: () => handleClear('paidStatus'),
    },
    {
      label: 'PO Type',
      value: poType,
      isClearable: true,
      onClear: () => handleClear('poType'),
    },
    {
      label: 'Sales Person',
      value: salesPersonName,
      isClearable: true,
      onClear: () => handleClear('salesPersonName'),
    },
  ].filter(
    (item) =>
      item.value &&
      (typeof item.value === 'string'
        ? item.value.trim() !== ''
        : Array.isArray(item.value)
          ? item.value.length > 0
          : true)
  );

  return (
    <div
      className={`w-full border-t mt-4 pt-4 flex items-center bg-[#7ed957] px-4 py-3 rounded-md shadow-sm ${className}`}
    >
      <div className='w-full flex justify-end'>
        <FilterSummary
          layout='grid'
          filters={filters}
          className='text-black text-lg'
        />
      </div>
    </div>
  );
}

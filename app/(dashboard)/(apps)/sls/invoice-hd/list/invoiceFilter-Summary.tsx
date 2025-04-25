'use client';
import { useState } from 'react'; // Tambahkan useState
import { useMonthYearPeriodStore, useSalesInvoiceHdFilterStore } from '@/store';
import { FilterSummary } from '@/components/filterSummary';
import { format } from 'date-fns';

export default function InvoiceFilterSummary() {
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

  // State untuk mengontrol visibility salesDashboardPage
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
    <div>
      {/* Render FilterSummary */}
      <FilterSummary
        layout='grid'
        filters={filters}
        className='text-muted-foreground'
      />

      {/* Render salesDashboardPage berdasarkan state */}
      {/* {showSalesDashboard && <SalesDashboardPage />} */}
    </div>
  );
}

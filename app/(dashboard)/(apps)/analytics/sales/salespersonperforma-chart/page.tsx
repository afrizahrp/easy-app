'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import SalesInvoiceFilterSummary from '@/components/sales/salesInvoiceFilterSummary';
import SalesPersonPerformaOverview from '../salespersonperforma-chart/components/salesPersonPerformaOverview';
import TopProductSoldBySalesPerson from '../salespersonperforma-chart/components/topProductSoldBySalesPerson';
import { SalesPersonInvoiceFilterSidebar } from '@/components/FilterSidebarButton/sales/salesPersonlnvoiceFilterSidebar';
import { PageHeaderWrapper } from '@/components/page-header-wrapper';
import { Table } from '@tanstack/react-table';
import SalesPersonInvoiceList from '../../../sales/salespersonInvoice/list/page';

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
  color?: string;
}

interface SalesPersonPerformaAnalyticsProps {
  showList?: boolean;
  showHeader?: boolean;
}

const SalesPersonPerformaAnalytics: React.FC<
  SalesPersonPerformaAnalyticsProps
> = ({ showList = true, showHeader = true }) => {
  const [fullChart, setFullChart] = useState<'period' | null>('period');
  const [selectedSalesPerson, setSelectedSalesPerson] = useState<string | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedColor, setSelecteColor] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { salesPersonName } = useSalesInvoiceHdFilterStore((state) => ({
    salesPersonName: state.salesPersonName,
  }));

  const chartRef = useRef<HTMLDivElement>(null);
  const topProductRef = useRef<HTMLDivElement>(null);

  const validSalesPersonNames = Array.isArray(salesPersonName)
    ? salesPersonName.filter((name) => typeof name === 'string' && name.trim())
    : salesPersonName && typeof salesPersonName === 'string' && salesPersonName
      ? [salesPersonName]
      : [];

  // Reset state saat salesPersonName dihapus, dengan perbandingan state
  useEffect(() => {
    if (
      validSalesPersonNames.length === 0 &&
      (selectedSalesPerson !== null ||
        selectedYear !== null ||
        selectedMonth !== null ||
        fullChart !== 'period')
    ) {
      setSelectedSalesPerson(null);
      setSelectedYear(null);
      setSelectedMonth(null);
      setSelecteColor(null);
      setFullChart('period');
    }
  }, [
    validSalesPersonNames,
    selectedSalesPerson,
    selectedYear,
    selectedMonth,
    selectedColor,
    fullChart,
  ]);

  const handleModeChange = (isFull: boolean) => {
    setFullChart(isFull ? 'period' : null);
    if (isFull) {
      setSelectedSalesPerson(null);
      setSelectedYear(null);
      setSelectedMonth(null);
      setSelecteColor(null);
    }
  };

  const handleSalesPersonSelect = (selection: SalesPersonSelection | null) => {
    if (selection) {
      setSelectedSalesPerson(selection.salesPersonName);
      setSelectedYear(selection.year || null);
      setSelectedMonth(selection.month || null);
      setSelecteColor(selection.color || null);

      setFullChart(null);
    } else {
      setSelectedSalesPerson(null);
      setSelectedYear(null);
      setSelectedMonth(null);
      setSelecteColor(null);

      setFullChart('period');
    }
  };

  const dummyTable = {
    getState: () => ({
      columnFilters: [],
      sorting: [],
      pagination: { pageIndex: 0, pageSize: 10 },
      globalFilter: '',
      rowSelection: {},
    }),
    getColumn: () => undefined,
    getFilteredRowModel: () => ({ rows: [] }),
    resetColumnFilters: () => {
      console.log('Reset column filters called on dummy table');
    },
    setColumnFilters: () => {},
  } as unknown as Table<any>;

  return (
    <div
      className={`relative flex flex-col w-full p-1 gap-4 ${
        showList ? 'h-screen' : 'h-fit min-h-0'
      }`}
    >
      {/* <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent className='pt-5 w-80 sm:w-96'>
          <SheetTitle>Filter Data</SheetTitle>
          <SalesPersonInvoiceFilterSidebar table={dummyTable} />
        </SheetContent>
      </Sheet> */}
      <PageHeaderWrapper
        show={showHeader}
        title='Sales Person Performance Analytics'
        hideBreadcrumb={false}
        breadcrumb={[
          { name: 'Analytics', href: '/analytics/sales' },
          {
            name: 'Sales Person Performance',
            href: '/analytics/sales/salespersonperforma-chart',
          },
        ]}
      />
      <div className='flex flex-col gap-2 w-full'>
        <div className='min-w-[200px]'>
          <SalesInvoiceFilterSummary />
        </div>
        <div
          className={`w-full gap-4 ${
            selectedSalesPerson && selectedMonth && fullChart !== 'period'
              ? 'grid grid-cols-1 md:grid-cols-2'
              : 'flex flex-col'
          }`}
        >
          <motion.div
            ref={chartRef}
            layout
            layoutId='chart'
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='w-full'
          >
            <SalesPersonPerformaOverview
              showFloatingButton={true}
              showList={showList}
              isFullWidth={fullChart === 'period'}
              onModeChange={handleModeChange}
              onSalesPersonSelect={handleSalesPersonSelect}
            />
          </motion.div>
          {selectedSalesPerson && selectedMonth && fullChart !== 'period' && (
            <motion.div
              ref={topProductRef}
              layout
              layoutId='top-product'
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className='min-w-0 w-full'
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <TopProductSoldBySalesPerson
                salesPersonName={selectedSalesPerson}
                year={selectedYear ?? undefined}
                month={selectedMonth ?? undefined}
                onClose={() => {
                  setSelectedSalesPerson(null);
                  setSelectedYear(null);
                  setSelectedMonth(null);
                  setFullChart('period');
                }}
              />
            </motion.div>
          )}
        </div>
        {showList && (
          <div className='w-full flex-1'>
            <PageHeaderWrapper title='Invoice List' />
            <SalesPersonInvoiceList />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPersonPerformaAnalytics;

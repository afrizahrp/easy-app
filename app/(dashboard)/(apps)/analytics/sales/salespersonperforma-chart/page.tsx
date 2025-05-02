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
import { FloatingFilterButton } from '@/components/ui/floating-filter-button';
import { Table } from '@tanstack/react-table';

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
}

interface SalesPersonPerformaAnalyticsProps {
  showList?: boolean;
  showHeader?: boolean;
  isCompact?: boolean; // Prop baru untuk kontrol compact di salesPage
}

const SalesPersonPerformaAnalytics: React.FC<
  SalesPersonPerformaAnalyticsProps
> = ({ showList = true, showHeader = true, isCompact = true }) => {
  const [fullChart, setFullChart] = useState<'period' | null>('period');
  const [selectedSalesPerson, setSelectedSalesPerson] = useState<string | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
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

  useEffect(() => {
    if (chartRef.current) {
      console.log(
        'Chart actual width:',
        chartRef.current.getBoundingClientRect().width
      );
    }
    if (topProductRef.current) {
      console.log(
        'TopProduct actual width:',
        topProductRef.current.getBoundingClientRect().width
      );
    }
  }, [
    fullChart,
    validSalesPersonNames,
    selectedSalesPerson,
    selectedYear,
    selectedMonth,
  ]);

  const handleModeChange = (isFull: boolean) => {
    setFullChart(isFull ? 'period' : null);
  };

  const handleSalesPersonSelect = (selection: SalesPersonSelection | null) => {
    if (selection) {
      setSelectedSalesPerson(selection.salesPersonName);
      setSelectedYear(selection.year || null);
      setSelectedMonth(selection.month || null);
    } else {
      setSelectedSalesPerson(null);
      setSelectedYear(null);
      setSelectedMonth(null);
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
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent className='pt-5 w-80 sm:w-96'>
          <SheetTitle>Filter Data</SheetTitle>
          <SalesPersonInvoiceFilterSidebar table={dummyTable} />
        </SheetContent>
      </Sheet>
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
      <div className='flex flex-col gap-2'>
        <div className='flex-1 min-w-[200px]'>
          <SalesInvoiceFilterSummary />
        </div>
        <div
          className={`w-full gap-4 ${fullChart === 'period' ? '' : 'grid grid-cols-1 md:grid-cols-2'}`}
        >
          <motion.div
            ref={chartRef}
            layout
            layoutId='chart'
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`min-w-0 ${fullChart === 'period' ? 'w-full' : 'w-full flex-1'}`}
            style={fullChart !== 'period' ? { flex: '1 1 50%' } : undefined}
          >
            <SalesPersonPerformaOverview
              showFloatingButton={true}
              showList={showList}
              isFullWidth={fullChart === 'period'}
              onModeChange={handleModeChange}
              onSalesPersonSelect={handleSalesPersonSelect}
              initialCompact={isCompact} // Pakai prop isCompact
            />
          </motion.div>
          {selectedSalesPerson && selectedMonth && fullChart !== 'period' && (
            <motion.div
              ref={topProductRef}
              layout
              layoutId='top-product'
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className='min-w-0 w-full flex-1'
              style={{ flex: '1 1 50%' }}
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
      </div>
    </div>
  );
};

export default SalesPersonPerformaAnalytics;

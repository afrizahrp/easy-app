'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import SalesInvoiceFilterSummary from '@/components/sales/salesInvoiceFilterSummary';
import SalesPersonPerformaOverview from '../salespersonperforma-chart/components/salesPersonPerformaOverview';
import TopProductSoldBySalesPerson from '../salespersonperforma-chart/components/topProductSoldBySalesPerson';
import SalesPersonInvoiceList from '../../../sales/salespersonInvoice/list/page';
import { SalesPersonInvoiceFilterSidebar } from '@/components/FilterSidebarButton/sales/salesPersonlnvoiceFilterSidebar';
import Draggable from 'react-draggable';

import { Table } from '@tanstack/react-table';

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
}

const SalesPersonPerformaAnalytics = () => {
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
  const { paidStatus } = useSalesInvoiceHdFilterStore((state) => ({
    paidStatus: state.paidStatus,
  }));

  const chartRef = useRef<HTMLDivElement>(null);
  const topProductRef = useRef<HTMLDivElement>(null);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const saved = localStorage.getItem('filterButtonPosition');
    if (saved) setButtonPosition(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'filterButtonPosition',
      JSON.stringify(buttonPosition)
    );
  }, [buttonPosition]);

  const handleModeChange = (isFull: boolean) => {
    console.log('handleModeChange:', isFull);
    setFullChart(isFull ? 'period' : null);
  };

  const handleSalesPersonSelect = (selection: SalesPersonSelection | null) => {
    console.log('handleSalesPersonSelect in Analytics:', selection);
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

  // Dummy table untuk sidebar (kosong, karena chart ga butuh)
  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setButtonPosition({ x: data.x, y: data.y });
  };

  // Dummy table yang aman
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
  } as unknown as Table<any>;

  return (
    <div className='relative flex flex-col h-screen w-full p-4 gap-4'>
      {/* Floating Button */}
      <Draggable
        defaultPosition={{ x: 0, y: 0 }}
        position={buttonPosition}
        onDrag={handleDrag}
      >
        <div
          className='fixed bottom-4 right-4 z-50'
          style={{
            transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
          }}
        >
          <Button
            size='sm'
            onClick={() => setIsSidebarOpen(true)}
            className='px-3 h-8 flex items-center gap-1 bg-primary text-white hover:bg-secondary-dark rounded-full hover:scale-105 transition-transform cursor-move shadow-md'
          >
            <Filter className='w-4 h-4' />
            Filter
          </Button>
        </div>
      </Draggable>

      {/* Sidebar as Sheet */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent className='pt-5 w-80 sm:w-96'>
          <SheetTitle>Filter Data</SheetTitle>
          <SalesPersonInvoiceFilterSidebar table={dummyTable} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className='flex flex-col gap-4'>
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
            onLayoutAnimationComplete={() => {
              console.log(
                'Chart width class:',
                fullChart === 'period' ? 'w-full' : 'w-full flex-1'
              );
              if (chartRef.current) {
                console.log(
                  'Chart actual width after animation:',
                  chartRef.current.getBoundingClientRect().width
                );
              }
            }}
          >
            <SalesPersonPerformaOverview
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
              className='min-w-0 w-full flex-1'
              style={{ flex: '1 1 50%' }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              onLayoutAnimationComplete={() => {
                console.log('TopProduct width class:', 'w-full flex-1');
                if (topProductRef.current) {
                  console.log(
                    'TopProduct actual width after animation:',
                    topProductRef.current.getBoundingClientRect().width
                  );
                }
              }}
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
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          className='w-full flex-1'
        >
          <SalesPersonInvoiceList />
        </motion.div>
      </div>
    </div>
  );
};

export default SalesPersonPerformaAnalytics;

// analytics/sales/salesinvoice-chart/components/SalesInvoiceOverview.tsx
'use client';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

import SalesInvoiceFilterSummary from '@/components/sales/salesInvoiceFilterSummary';
import SalesByPeriod from './salesInvoiceByPeriodChart';
import SalesByPoType from './salesInvoiceByPoTypeChart';
import SalesInvoiceHdList from '@/app/(dashboard)/(apps)/sales/invoice-hd/list/page';
import Draggable from 'react-draggable';

import { Table } from '@tanstack/react-table';
import PageHeaderWrapper from '@/components/page-header-wrapper';
import { useEffect, useState } from 'react';
import { GeneralInvoiceFilterSidebar } from '@/components/FilterSidebarButton/sales/generalnvoiceFilterSidebar';
interface SalesInvoiceOverviewProps {
  showList?: boolean;
  fullChart?: 'period' | 'poType' | null;
  onFilterChange?: (filters: { period?: string; poType?: string }) => void;
}

const SalesInvoiceOverview: React.FC<SalesInvoiceOverviewProps> = ({
  showList = true,
  fullChart = null,
  onFilterChange,
}) => {
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    resetColumnFilters: () => {
      // Kosong aja, karena ini dummy
      console.log('Reset column filters called on dummy table');
    },
    setColumnFilters: () => {
      // Kosong, buat jaga-jaga
    },
  } as unknown as Table<any>;

  return (
    <div className='relative flex flex-col h-screen w-full p-4 gap-4'>
      <PageHeaderWrapper
        show={true}
        title='Sales Invoice'
        breadcrumb={[
          { name: 'Analytics', href: '/analytics/sales' },
          {
            name: 'Sales Invoice Analytics',
            href: '/dashboard/apps/sales/invoice-hd',
          },
        ]}
      />

      <div className='flex-1 min-w-[200px]'>
        <SalesInvoiceFilterSummary />
      </div>

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
          <GeneralInvoiceFilterSidebar table={dummyTable} />
        </SheetContent>
      </Sheet>

      {/* Bagian Chart */}
      <div className='flex flex-col md:flex-row w-full gap-4'>
        {(fullChart === null || fullChart === 'period') && (
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={fullChart === 'period' ? 'w-full' : 'w-full md:w-1/2'}
          >
            <SalesByPeriod
              isFullWidth={fullChart === 'period'}
              onModeChange={(isFull) =>
                onFilterChange?.({ period: isFull ? 'full' : undefined })
              }
            />
          </motion.div>
        )}

        {(fullChart === null || fullChart === 'poType') && (
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={fullChart === 'poType' ? 'w-full' : 'w-full md:w-1/2'}
          >
            <SalesByPoType
              isFullWidth={fullChart === 'poType'}
              onModeChange={(isFull) =>
                onFilterChange?.({ poType: isFull ? 'full' : undefined })
              }
            />
          </motion.div>
        )}
      </div>

      {/* Bagian Table */}
      {showList && (
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          className='w-full flex-1'
        >
          <PageHeaderWrapper title='Invoice List' />
          <SalesInvoiceHdList />
        </motion.div>
      )}
    </div>
  );
};

export default SalesInvoiceOverview;

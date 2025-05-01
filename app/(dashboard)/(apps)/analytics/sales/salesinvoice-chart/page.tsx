'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Impor Framer Motion
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import SalesInvoiceFilterSummary from '@/components/sales/salesInvoiceFilterSummary';
import SalesInvoiceOverview from '../salesinvoice-chart/components/salesInvoiceOverview';
import { GeneralInvoiceFilterSidebar } from '@/components/FilterSidebarButton/sales/generalnvoiceFilterSidebar';
import Draggable from 'react-draggable';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { PageHeaderWrapper } from '@/components/page-header-wrapper';
import { FloatingFilterButton } from '@/components/ui/floating-filter-button';

interface SalesInvoiceAnalyticsProps {
  showList?: boolean;
  showHeader?: boolean;
}

const SalesInvoiceAnalytics: React.FC<SalesInvoiceAnalyticsProps> = ({
  showList = true,
  showHeader = true,
}) => {
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fullChart, setFullChart] = useState<'period' | 'poType' | null>(null);

  const handleFilterChange = (filters: {
    period?: string;
    poType?: string;
  }) => {
    if (filters.period === 'full') {
      setFullChart('period');
    } else if (filters.poType === 'full') {
      setFullChart('poType');
    } else {
      setFullChart(null);
    }
  };

  useEffect(() => {
    localStorage.setItem(
      'filterButtonPosition',
      JSON.stringify(buttonPosition)
    );
  }, [buttonPosition]);

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setButtonPosition({ x: data.x, y: data.y });
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
    resetColumnFilters: () => {},
    setColumnFilters: () => {},
  } as unknown as Table<any>;

  // Definisikan varian animasi
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className='relative flex flex-col h-screen w-full p-1 gap-4'>
      <FloatingFilterButton
        onClick={() => setIsSidebarOpen(true)}
        showFloatingButton={true}
      />

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent className='pt-5 w-80 sm:w-96'>
          <SheetTitle>Filter Data</SheetTitle>
          <GeneralInvoiceFilterSidebar table={dummyTable} />
        </SheetContent>
      </Sheet>

      {/* Animasi untuk PageHeaderWrapper */}
      {showHeader && (
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          <PageHeaderWrapper
            show={showHeader}
            title='Sales Invoice Analytics'
            hideBreadcrumb={false}
            breadcrumb={[
              { name: 'Analytics', href: '/analytics/sales' },
              {
                name: 'Sales Invoice Analytics',
                href: '/analytics/sales/salesinvoice-chart',
              },
            ]}
          />
        </motion.div>
      )}

      {/* Animasi untuk SalesInvoiceFilterSummary */}

      <div className='flex flex-col gap-2'>
        <div className='flex-1 min-w-[200px]'>
          <SalesInvoiceFilterSummary />
        </div>

        <motion.div
          className='flex-1 min-w-[200px]'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        ></motion.div>

        {/* Animasi untuk SalesInvoiceOverview dengan layout */}
        <motion.div
          layout // Aktifkan animasi layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }} // Transisi mulus
          className='w-full'
        >
          <SalesInvoiceOverview
            showList={showList}
            fullChart={fullChart}
            onFilterChange={handleFilterChange}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SalesInvoiceAnalytics;

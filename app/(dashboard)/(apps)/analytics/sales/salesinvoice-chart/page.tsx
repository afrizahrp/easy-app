'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Table } from '@tanstack/react-table';
import SalesInvoiceFilterSummary from '@/components/sales/salesInvoiceFilterSummary';
import SalesInvoiceOverview from '../salesinvoice-chart/components/salesInvoiceOverview';
import { GeneralInvoiceFilterSidebar } from '@/components/FilterSidebarButton/sales/generalnvoiceFilterSidebar';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { FloatingFilterButton } from '@/components/ui/floating-filter-button';
import { PageHeaderWrapper } from '@/components/page-header-wrapper';

interface SalesInvoiceAnalyticsProps {
  showList?: boolean;
  showHeader?: boolean;
}

const SalesInvoiceAnalytics: React.FC<SalesInvoiceAnalyticsProps> = ({
  showList = true,
  showHeader = true,
}) => {
  const [fullChart, setFullChart] = useState<'period' | 'poType' | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div
      className={`relative flex flex-col w-full p-1 gap-4 ${
        showList ? 'h-screen' : 'h-fit min-h-0'
      }`}
    >
      {/* <FloatingFilterButton>
        <GeneralInvoiceFilterSidebar table={dummyTable} />
      </FloatingFilterButton> */}

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

      <div className='flex flex-col gap-2'>
        <div className='min-w-[200px]'>
          <SalesInvoiceFilterSummary context='salesInvoice' />
        </div>

        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className='w-full'
        >
          <SalesInvoiceOverview
            showFloatingButton={showList}
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

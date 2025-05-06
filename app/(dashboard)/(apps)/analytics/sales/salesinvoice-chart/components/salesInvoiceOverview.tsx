'use client';

import React from 'react';
import { Table } from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import MonthlySalesInvoiceChart from './monthlySalesInvoiceChart';
import MonthlySalesInvoiceByPoTypeChart from './monthlySalesInvoiceByPoTypeChart';
import SalesInvoiceHdList from '@/app/(dashboard)/(apps)/sales/salesInvoiceHd/list/page';
import { PageHeaderWrapper } from '@/components/page-header-wrapper';
import { FloatingFilterButton } from '@/components/ui/floating-filter-button';
import { SalesInvoiceFilterSidebar } from '@/components/FilterSidebarButton/sales/saleslnvoiceFilterSidebar';

interface SalesInvoiceOverviewProps {
  showFloatingButton?: boolean;
  showList?: boolean;
  fullChart?: 'period' | 'poType' | null;
  onFilterChange?: (filters: { period?: string; poType?: string }) => void;
}

const SalesInvoiceOverview: React.FC<SalesInvoiceOverviewProps> = ({
  showFloatingButton = true,
  showList = true,
  fullChart = null,
  onFilterChange,
}) => {
  const chartLayoutClass =
    'flex flex-col md:flex-row w-full gap-4 items-stretch min-w-0';

  const handlePeriodModeChange = (isFull: boolean) => {
    onFilterChange?.({
      period: isFull ? 'full' : undefined,
      poType: undefined,
    });
  };

  const handlePoTypeModeChange = (isFull: boolean) => {
    onFilterChange?.({
      poType: isFull ? 'full' : undefined,
      period: undefined,
    });
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

  return (
    <div
      className={`flex flex-col w-full p-2 gap-4 ${showList ? 'h-screen' : 'h-fit min-h-0'}`}
    >
      {showFloatingButton && (
        <div className='flex-none w-full md:w-1/2'>
          <FloatingFilterButton
            title='Filter Sales Invoice'
            description='Filter sales invoices by date and type.'
          >
            <SalesInvoiceFilterSidebar
              table={dummyTable}
              context='salesInvoice'
            />
          </FloatingFilterButton>
        </div>
      )}

      {showList ? (
        <div className={chartLayoutClass}>
          <AnimatePresence>
            {(fullChart === null || fullChart === 'period') && (
              <motion.div
                key='periodChart'
                className={`flex-none ${fullChart === 'period' ? 'w-full' : 'w-full md:w-1/2'} overflow-x-auto max-w-full`}
                initial={{ opacity: 0, x: -20 }} // Animasi dari kiri
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <MonthlySalesInvoiceChart
                  isFullWidth={fullChart === 'period'}
                  onModeChange={handlePeriodModeChange}
                  height={400}
                  isCompact={false}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {(fullChart === null || fullChart === 'poType') && (
              <motion.div
                key='poTypeChart'
                className={`flex-none ${fullChart === 'poType' ? 'w-full' : 'w-full md:w-1/2'} overflow-x-auto max-w-full`}
                initial={{ opacity: 0, x: 20 }} // Animasi dari kanan
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <MonthlySalesInvoiceByPoTypeChart
                  isFullWidth={fullChart === 'poType'}
                  onModeChange={handlePoTypeModeChange}
                  height={400}
                  isCompact={false}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className='w-full overflow-x-auto max-w-full h-fit min-h-0'>
          <MonthlySalesInvoiceChart
            isFullWidth={fullChart === 'period'}
            onModeChange={handlePeriodModeChange}
            height={250}
            isCompact={true}
          />
        </div>
      )}

      {showList && (
        <div className='w-full flex-1'>
          <PageHeaderWrapper title='Invoice List' />
          <SalesInvoiceHdList showFilterButton={false} />
        </div>
      )}
    </div>
  );
};

export default SalesInvoiceOverview;

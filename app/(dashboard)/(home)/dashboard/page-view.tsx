'use client';
import React, { useState, useEffect } from 'react';
import { useSessionStore } from '@/store';
import { FloatingFilterButton } from '@/components/ui/floating-filter-button';
import { ChartYearFilter } from '@/components/ui/chartYearFilter';
import YearlySalesInvoiceChart from './components/yearlySalesInvoiceChart';
import YearlySalesPersonInvoiceChart from './components/yearlySalesPersonInvoiceChart';
import ChartYearFilterSummary from '@/components/ui/chartYearFilterSummary';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface User {
  id?: string;
  name?: string;
}

interface SessionStore {
  user: User | null;
}

interface DashboardPageViewProps {
  trans?: Record<string, string>;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className={cn(
      'bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 transition-colors duration-300', // Kurangi padding
      className
    )}
  >
    {title && (
      <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>
        {title}
      </h2>
    )}
    {children}
  </motion.div>
);

const DashboardPageView: React.FC<DashboardPageViewProps> = ({
  trans = {},
}) => {
  const { user } = useSessionStore() as SessionStore;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Default translations
  const defaultTrans = {
    showChartByYears: 'Show Chart by Years',
    filterChartsByYear: 'Filter charts by year',
    openChartYearFilter: 'Open chart year filter',
    showChartsByYear: 'Show Charts by Year',
    selectChartYear: 'Select chart year',
    yearlySalesInvoice: 'Yearly Sales Invoice',
    salesPersonInvoice: 'Sales Person Invoice',
  };

  const t = { ...defaultTrans, ...trans };

  return (
    <div className='p-2 md:p-4 lg:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300 w-full max-w-full'>
      <motion.div
        className='sticky top-4 z-10'
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <FloatingFilterButton
          title={t.showChartByYears}
          description={t.filterChartsByYear}
          className='mb-4 hover:scale-105 transition-transform duration-200'
          aria-label={t.openChartYearFilter}
        >
          <ChartYearFilter
            title={t.showChartsByYear}
            className='max-w-xs mb-6'
            aria-label={t.selectChartYear}
          />
        </FloatingFilterButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ChartYearFilterSummary className='mb-6 text-gray-700 dark:text-gray-300' />
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 w-full overflow-x-auto max-w-full'>
        <AnimatePresence>
          {isLoading ? (
            <>
              <Card key='skeleton1'>
                <Skeleton className='h-[600px] w-full rounded-lg' />
              </Card>
              <Card key='skeleton2'>
                <Skeleton className='h-[600px] w-full rounded-lg' />
              </Card>
            </>
          ) : (
            <>
              <Card title={t.yearlySalesInvoice} key='chart1'>
                <YearlySalesInvoiceChart
                  height={600}
                  isCompact={false}
                  isFullWidth={true}
                  onModeChange={(isFull: boolean) =>
                    console.log('Mode changed:', isFull)
                  }
                />
              </Card>
              <Card title={t.salesPersonInvoice} key='chart2'>
                <YearlySalesPersonInvoiceChart
                  height={600}
                  isCompact={false}
                  isFullWidth={true}
                  onModeChange={(isFull: boolean) =>
                    console.log('Sales Person Mode changed:', isFull)
                  }
                />
              </Card>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPageView;

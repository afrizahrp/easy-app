'use client';
import React, { useState, useEffect } from 'react';
import { useSessionStore } from '@/store';
import { FloatingFilterButton } from '@/components/ui/floating-filter-button';
import { ChartYearFilter } from '@/components/ui/chartYearFilter';
import YearlySalesInvoiceChart from './components/yearlySalesInvoiceChart';
import YearlySalesPersonInvoiceChart from './components/yearlySalesPersonInvoiceChart';
import ChartYearFilterSummary from '@/components/ui/chartYearFilterSummary';
import { cn } from '@/lib/utils'; // Utility for className concatenation
import { motion, AnimatePresence } from 'framer-motion'; // Framer Motion for animations
import { Skeleton } from '@/components/ui/skeleton'; // Skeleton for loading states

// Define types for session store
interface User {
  // Define user properties based on your store
  id?: string;
  name?: string;
  // Add other relevant fields
}

interface SessionStore {
  user: User | null;
}

// Define props for DashboardPageView
interface DashboardPageViewProps {
  trans: Record<string, string>;
}

// Define props for Card component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

// Reusable Card component
const Card: React.FC<CardProps> = ({ children, className, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className={cn(
      'bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-300',
      className
    )}
  >
    {title && (
      <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4'>
        {title}
      </h2>
    )}
    {children}
  </motion.div>
);

const DashboardPageView: React.FC<DashboardPageViewProps> = ({ trans }) => {
  const { user } = useSessionStore() as SessionStore;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate loading (replace with actual data fetching logic)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300'>
      {/* Sticky Floating Filter Button with Animation */}
      <motion.div
        className='sticky top-4 z-10'
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <FloatingFilterButton
          title={trans['showChartByYears'] || 'Show Chart by Years'}
          description={trans['filterChartsByYear'] || 'Filter charts by year'}
          className='mb-4 hover:scale-105 transition-transform duration-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          aria-label={trans['openChartYearFilter'] || 'Open chart year filter'}
        >
          <ChartYearFilter
            title={trans['showChartsByYear'] || 'Show Charts by Year'}
            className='max-w-xs mb-6 font-semibold text-gray-800 dark:text-gray-200'
            aria-label={trans['selectChartYear'] || 'Select chart year'}
          />
        </FloatingFilterButton>
      </motion.div>

      {/* Chart Year Filter Summary with Fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ChartYearFilterSummary className='mb-6 text-gray-700 dark:text-gray-300' />
      </motion.div>

      {/* Responsive Grid with Loading States */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
        <AnimatePresence>
          {isLoading ? (
            <>
              <Card key='skeleton1'>
                <Skeleton className='h-[400px] w-full rounded-lg' />
              </Card>
              <Card key='skeleton2'>
                <Skeleton className='h-[400px] w-full rounded-lg' />
              </Card>
            </>
          ) : (
            <>
              <Card
                title={trans['yearlySalesInvoice'] || 'Yearly Sales Invoice'}
                key='chart1'
              >
                <YearlySalesInvoiceChart
                  height={400}
                  isCompact={false}
                  isFullWidth={false}
                  onModeChange={(isFull: boolean) =>
                    console.log('Mode changed:', isFull)
                  }
                />
              </Card>
              <Card
                title={trans['salesPersonInvoice'] || 'Sales Person Invoice'}
                key='chart2'
              >
                <YearlySalesPersonInvoiceChart
                  isCompact={false}
                  isFullWidth={false}
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

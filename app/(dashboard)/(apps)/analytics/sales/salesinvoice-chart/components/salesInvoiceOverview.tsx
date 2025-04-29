// analytics/sales/salesinvoice-chart/components/SalesInvoiceOverview.tsx
'use client';
import { motion } from 'framer-motion';
import SalesInvoiceFilterSummary from '@/components/sales/salesInvoiceFilterSummary';
import SalesByPeriod from '../components/salesByPeriod';
import SalesByPoType from '../components/salesByPoType';
import SalesInvoiceHdList from '@/app/(dashboard)/(apps)/sales/invoice-hd/list/page';
interface SalesInvoiceOverviewProps {
  fullChart?: 'period' | 'poType' | null;
  onFilterChange?: (filters: { period?: string; poType?: string }) => void;
}

const SalesInvoiceOverview: React.FC<SalesInvoiceOverviewProps> = ({
  fullChart = null,
  onFilterChange,
}) => {
  return (
    <div className='flex flex-col h-screen w-full p-4 gap-4'>
      {/* Bagian Filter */}
      <div className='flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg bg-white shadow-sm border border-muted-200'>
        <div className='flex-1 min-w-[200px]'>
          <SalesInvoiceFilterSummary />
        </div>
      </div>

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
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        className='w-full flex-1'
      >
        <SalesInvoiceHdList />
      </motion.div>
    </div>
  );
};

export default SalesInvoiceOverview;

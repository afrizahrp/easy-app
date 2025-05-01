'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SalesInvoiceFilterSummary from '@/components/sales/salesInvoiceFilterSummary';
import SalesByPeriodChart from '../../analytics/sales/salesinvoice-chart/components/salesInvoiceByPeriodChart';
import SalesByPeriodAndPoTypeChart from '../../analytics/sales/salesinvoice-chart/components/salesInvoiceByPoTypeChart';
import SalesInvoiceHdPage from '../../sales/invoice-hd/list/page';

const SalesDashboardPage = () => {
  const [fullChart, setFullChart] = useState<'period' | 'poType' | null>(null);

  return (
    <div className='flex flex-col h-screen w-full p-4 gap-4'>
      {/* Bagian Chart */}

      <div className='flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg bg-white shadow-sm border border-muted-200'>
        <div className='flex-1 min-w-[200px]'>
          <SalesInvoiceFilterSummary />
        </div>
      </div>

      <div className='flex flex-col md:flex-row w-full gap-4'>
        {(fullChart === null || fullChart === 'period') && (
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={fullChart === 'period' ? 'w-full' : 'w-full md:w-1/2'}
          >
            <SalesByPeriodChart
              isFullWidth={fullChart === 'period'}
              onModeChange={(isFull) => setFullChart(isFull ? 'period' : null)}
            />
          </motion.div>
        )}

        {(fullChart === null || fullChart === 'poType') && (
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={fullChart === 'poType' ? 'w-full' : 'w-full md:w-1/2'}
          >
            <SalesByPeriodAndPoTypeChart
              isFullWidth={fullChart === 'poType'}
              onModeChange={(isFull) => setFullChart(isFull ? 'poType' : null)}
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
        <SalesInvoiceHdPage />
      </motion.div>
    </div>
  );
};

export default SalesDashboardPage;

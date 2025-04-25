'use client';

import { useState } from 'react';
import SalesByPeriodChart from '../../imc/dashboard/salesByPoType/page';
import SalesByPeriodAndPoTypeChart from '../../imc/dashboard/salesYearPeriod/page';
import SalesInvoiceHdPage from '../../sls/invoice-hd/list/page';
import { motion } from 'framer-motion';

const SalesDashboardPage = () => {
  const [fullChart, setFullChart] = useState<'period' | 'poType' | null>(null);

  return (
    <div className='flex flex-col h-screen w-full p-4 gap-4'>
      {/* Bagian Chart */}
      <div className='flex flex-col md:flex-row w-full gap-4'>
        {(fullChart === null || fullChart === 'period') && (
          <div
            className={fullChart === 'period' ? 'w-full' : 'w-full md:w-1/2'}
          >
            <SalesByPeriodChart
              isFullWidth={fullChart === 'period'}
              onModeChange={(isFull) => setFullChart(isFull ? 'period' : null)}
            />
          </div>
        )}

        {(fullChart === null || fullChart === 'poType') && (
          <div
            className={fullChart === 'poType' ? 'w-full' : 'w-full md:w-1/2'}
          >
            <SalesByPeriodAndPoTypeChart
              isFullWidth={fullChart === 'poType'}
              onModeChange={(isFull) => setFullChart(isFull ? 'poType' : null)}
            />
          </div>
        )}
      </div>

      {/* Bagian Table */}
      <div className='w-full flex-1'>
        <SalesInvoiceHdPage />
      </div>
    </div>
  );
};

export default SalesDashboardPage;

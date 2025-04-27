'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SalesInvoiceFilterSummary from '@/components/sales/sls-invoiceFilter-Summary';
import SalesPersonByPeriodChart from './salesBySalesPersonByPeriodChart/salesBySalesPersonUnFilteredChart/page';
import SalesPersonInvoiceList from '../../sls/salespersonInvoice/list/page';
import { useSalesInvoiceHdFilterStore } from '@/store';
import SalesBySalesPersonByPeriodChart from './salesBySalesPersonByPeriodChart/page';

const SalesBySalesPersonFilteredChart = () => {
  const [fullChart, setFullChart] = useState<'period' | null>(null); // Hapus 'poType' jika tidak digunakan
  const { salesPersonName } = useSalesInvoiceHdFilterStore((state) => ({
    salesPersonName: state.salesPersonName,
  }));

  // Validasi salesPersonName agar hanya mengirim array yang valid
  const validSalesPersonNames = Array.isArray(salesPersonName)
    ? salesPersonName.filter((name) => typeof name === 'string' && name.trim())
    : salesPersonName && typeof salesPersonName === 'string' && salesPersonName
      ? [salesPersonName]
      : [];

  // Debugging: Log salesPersonName untuk memastikan filter dari store benar
  console.log('salesPersonName dari store:', salesPersonName);
  console.log('validSalesPersonNames:', validSalesPersonNames);

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
            <SalesBySalesPersonByPeriodChart
              isFullWidth={fullChart === 'period'}
              onModeChange={(isFull) => setFullChart(isFull ? 'period' : null)}
              salesPersonNames={validSalesPersonNames}
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
        <SalesPersonInvoiceList />
      </motion.div>
    </div>
  );
};

export default SalesBySalesPersonFilteredChart;

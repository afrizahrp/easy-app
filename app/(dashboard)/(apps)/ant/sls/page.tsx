'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSalesInvoiceHdFilterStore } from '@/store';

import SalesInvoiceFilterSummary from '@/components/sales/sls-invoiceFilter-Summary';
import SalesPersonPerformaChart from '../sls/salesPersonPerformaChart/page';
import TopProductSoldBySalesPerson from '../sls/salesPersonPerformaChart/topProductSoldBySalesPerson/page';
import SalesPersonInvoiceList from '../../sls/salespersonInvoice/list/page';

const SalesPersonPerformaAnalytics = () => {
  const [fullChart, setFullChart] = useState<'period' | null>(null);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState<string | null>(
    null
  );

  const { salesPersonName } = useSalesInvoiceHdFilterStore((state) => ({
    salesPersonName: state.salesPersonName,
  }));

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // For debugging
  const validSalesPersonNames = Array.isArray(salesPersonName)
    ? salesPersonName.filter((name) => typeof name === 'string' && name.trim())
    : salesPersonName && typeof salesPersonName === 'string' && salesPersonName
      ? [salesPersonName]
      : [];

  console.log('salesPersonName dari store:', salesPersonName);
  console.log('validSalesPersonNames:', validSalesPersonNames);
  console.log(
    'selectedSalesPerson:',
    selectedSalesPerson,

    'selectedYear:',
    selectedYear,
    'selectedMonth:',
    selectedMonth
  );

  const handleModeChange = (isFull: boolean) => {
    setFullChart(isFull ? 'period' : null);
    if (isFull) {
      setSelectedSalesPerson(null);
      setSelectedYear(null); // Reset year saat kembali ke full-width
      setSelectedMonth(null); // Reset month saat kembali ke full-width
    }
  };

  const handleSalesPersonSelect = (
    selection: {
      salesPersonName: string;
      year: string;
      month: string;
    } | null
  ) => {
    if (selection) {
      setSelectedSalesPerson(selection.salesPersonName);
      setSelectedYear(selection.year);
      setSelectedMonth(selection.month);
    } else {
      setSelectedSalesPerson(null);
      setSelectedYear(null);
      setSelectedMonth(null);
    }
  };

  console.log('selected year di SalesPersonPerformaAnalytics:', selectedYear);
  return (
    <div className='flex flex-col h-screen w-full p-4 gap-4'>
      {/* Filter Section */}
      <div className='flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg bg-white shadow-sm border border-muted-200'>
        <div className='flex-1 min-w-[200px]'>
          <SalesInvoiceFilterSummary />
        </div>
      </div>

      {/* Chart Section */}
      <div className='flex flex-col md:flex-row w-full gap-4'>
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={
            fullChart === 'period' && !selectedSalesPerson
              ? 'w-full'
              : 'w-full md:w-1/2'
          }
        >
          <SalesPersonPerformaChart
            isFullWidth={fullChart === 'period' && !selectedSalesPerson}
            onModeChange={handleModeChange}
            onSalesPersonSelect={handleSalesPersonSelect}
          />
        </motion.div>
        {selectedSalesPerson && selectedMonth && (
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='w-full md:w-1/2'
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <TopProductSoldBySalesPerson
              salesPersonName={selectedSalesPerson}
              year={selectedYear ?? undefined}
              month={selectedMonth ?? undefined}
              onClose={() => {
                setSelectedSalesPerson(null);
                setSelectedYear(null);
                setSelectedMonth(null);
                setFullChart('period'); // Return to full-width
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Table Section */}
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

export default SalesPersonPerformaAnalytics;

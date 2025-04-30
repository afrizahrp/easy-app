'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSalesInvoiceHdFilterStore } from '@/store';
import SalesInvoiceFilterSummary from '@/components/sales/salesInvoiceFilterSummary';
import SalesPersonPerformaOverview from '../salespersonperforma-chart/components/salesPersonPerformaOverview';
import TopProductSoldBySalesPerson from '../salespersonperforma-chart/components/topProductSoldBySalesPerson';
import SalesPersonInvoiceList from '../../../sales/salespersonInvoice/list/page';
import { HeaderPeriodFilterSection } from '@/components/sales/HeaderPeriodFilterSection';

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
}

const SalesPersonPerformaAnalytics = () => {
  const [fullChart, setFullChart] = useState<'period' | null>('period');
  const [selectedSalesPerson, setSelectedSalesPerson] = useState<string | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const { salesPersonName } = useSalesInvoiceHdFilterStore((state) => ({
    salesPersonName: state.salesPersonName,
  }));

  const chartRef = useRef<HTMLDivElement>(null);
  const topProductRef = useRef<HTMLDivElement>(null);

  const validSalesPersonNames = Array.isArray(salesPersonName)
    ? salesPersonName.filter((name) => typeof name === 'string' && name.trim())
    : salesPersonName && typeof salesPersonName === 'string'
      ? [salesPersonName]
      : [];

  useEffect(() => {
    if (chartRef.current) {
      console.log(
        'Chart actual width:',
        chartRef.current.getBoundingClientRect().width
      );
    }
    if (topProductRef.current) {
      console.log(
        'TopProduct actual width:',
        topProductRef.current.getBoundingClientRect().width
      );
    }
  }, [
    fullChart,
    validSalesPersonNames,
    selectedSalesPerson,
    selectedYear,
    selectedMonth,
  ]);

  const handleModeChange = (isFull: boolean) => {
    setFullChart(isFull ? 'period' : null);
  };

  const handleSalesPersonSelect = (selection: SalesPersonSelection | null) => {
    if (selection) {
      setSelectedSalesPerson(selection.salesPersonName);
      setSelectedYear(selection.year || null);
      setSelectedMonth(selection.month || null);
    } else {
      setSelectedSalesPerson(null);
      setSelectedYear(null);
      setSelectedMonth(null);
      setFullChart('period');
    }
  };

  return (
    <div className='flex flex-col h-screen w-full p-4 gap-4'>
      {/* Section: Header Summary & Filter */}
      <section className='rounded-lg bg-white shadow-sm border border-muted-200 p-4 flex flex-col gap-4'>
        <SalesInvoiceFilterSummary />
        <HeaderPeriodFilterSection
          onPeriodChange={() => {
            // Optionally refetch data
          }}
        />
      </section>

      {/* Section: Chart + Top Product */}
      <section
        className={`w-full gap-4 ${
          fullChart === 'period' ? '' : 'grid grid-cols-1 md:grid-cols-2'
        }`}
      >
        <motion.div
          ref={chartRef}
          layout
          layoutId='chart'
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`min-w-0 ${fullChart === 'period' ? 'w-full' : 'w-full flex-1'}`}
          style={fullChart !== 'period' ? { flex: '1 1 50%' } : undefined}
        >
          <SalesPersonPerformaOverview
            isFullWidth={fullChart === 'period'}
            onModeChange={handleModeChange}
            onSalesPersonSelect={handleSalesPersonSelect}
          />
        </motion.div>

        {selectedSalesPerson && selectedMonth && fullChart !== 'period' && (
          <motion.div
            ref={topProductRef}
            layout
            layoutId='top-product'
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='min-w-0 w-full flex-1'
            style={{ flex: '1 1 50%' }}
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
                setFullChart('period');
              }}
            />
          </motion.div>
        )}
      </section>

      {/* Section: Invoice List */}
      <motion.section
        layout
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        className='w-full flex-1'
      >
        <SalesPersonInvoiceList />
      </motion.section>
    </div>
  );
};

export default SalesPersonPerformaAnalytics;

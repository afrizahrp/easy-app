'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSalesInvoiceHdFilterStore } from '@/store';
import SalesInvoiceFilterSummary from '@/components/sales/salesInvoiceFilterSummary';
import SalesPersonPerformaOverview from '../salespersonperforma-chart/components/salesPersonPerformaOverview';
import TopProductSoldBySalesPerson from '../salespersonperforma-chart/components/topProductSoldBySalesPerson';
import SalesPersonInvoiceList from '../../../sales/salespersonInvoice/list/page';

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
    : salesPersonName && typeof salesPersonName === 'string' && salesPersonName
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
    console.log('handleModeChange:', isFull);
    setFullChart(isFull ? 'period' : null);
  };

  const handleSalesPersonSelect = (selection: SalesPersonSelection | null) => {
    console.log('handleSalesPersonSelect in Analytics:', selection);
    if (selection) {
      setSelectedSalesPerson(selection.salesPersonName);
      setSelectedYear(selection.year || null);
      setSelectedMonth(selection.month || null);
    } else {
      setSelectedSalesPerson(null);
      setSelectedYear(null);
      setSelectedMonth(null);
      setFullChart('period'); // Pastikan kembali ke full-width saat reset
    }
  };

  return (
    <div className='flex flex-col h-screen w-full p-4 gap-4'>
      <div className='flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg bg-white shadow-sm border border-muted-200'>
        <div className='flex-1 min-w-[200px]'>
          <SalesInvoiceFilterSummary />
        </div>
      </div>
      <div
        className={`w-full gap-4 ${fullChart === 'period' ? '' : 'grid grid-cols-1 md:grid-cols-2'}`}
      >
        <motion.div
          ref={chartRef}
          layout
          layoutId='chart'
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`min-w-0 ${fullChart === 'period' ? 'w-full' : 'w-full flex-1'}`}
          style={fullChart !== 'period' ? { flex: '1 1 50%' } : undefined}
          onLayoutAnimationComplete={() => {
            console.log(
              'Chart width class:',
              fullChart === 'period' ? 'w-full' : 'w-full flex-1'
            );
            if (chartRef.current) {
              console.log(
                'Chart actual width after animation:',
                chartRef.current.getBoundingClientRect().width
              );
            }
          }}
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
            onLayoutAnimationComplete={() => {
              console.log('TopProduct width class:', 'w-full flex-1');
              if (topProductRef.current) {
                console.log(
                  'TopProduct actual width after animation:',
                  topProductRef.current.getBoundingClientRect().width
                );
              }
            }}
          >
            <TopProductSoldBySalesPerson
              salesPersonName={selectedSalesPerson}
              year={selectedYear ?? undefined}
              month={selectedMonth ?? undefined}
              onClose={() => {
                setSelectedSalesPerson(null);
                setSelectedYear(null);
                setSelectedMonth(null);
                setFullChart('period'); // Kembalikan ke full-width
              }}
            />
          </motion.div>
        )}
      </div>
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

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSalesInvoiceHdFilterStore, useMonthYearPeriodStore } from '@/store';
import SalesInvoiceFilterSummary from '@/components/sales/salesInvoiceFilterSummary';
import SalesPersonPerformaOverview from '../salespersonperforma-chart/components/salesPersonPerformaOverview';
import TopProductSoldBySalesPerson from '../salespersonperforma-chart/components/topProductSoldBySalesPerson';
import SalesPersonInvoiceList from '../../../sales/salespersonInvoice/list/page';
import { HeaderPeriodFilterSection } from '@/components/sales/HeaderPeriodFilterSection';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const SalesPersonPerformaAnalytics = () => {
  const [fullChart, setFullChart] = useState<'period' | null>('period');
  const [selectedSalesPerson, setSelectedSalesPerson] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const { salesPersonName } = useSalesInvoiceHdFilterStore((state) => ({
    salesPersonName: state.salesPersonName,
  }));

  const { startPeriod, endPeriod } = useMonthYearPeriodStore();
  const { toast } = useToast();

  const validSalesPersonNames = Array.isArray(salesPersonName)
    ? salesPersonName.filter((name) => typeof name === 'string' && name.trim())
    : salesPersonName && typeof salesPersonName === 'string' && salesPersonName
      ? [salesPersonName]
      : [];

  const chartRef = useRef<HTMLDivElement>(null);
  const topProductRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // console.log('Analytics useEffect triggered with:', {
    //   fullChart,
    //   validSalesPersonNames,
    //   selectedSalesPerson,
    //   startPeriod,
    //   endPeriod,
    // });
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
    startPeriod,
    endPeriod,
  ]);

  const handleModeChange = useCallback((isFull: boolean) => {
    // console.log('handleModeChange called with:', isFull);
    setFullChart(isFull ? 'period' : null);
  }, []);

  const handleSalesPersonSelect = useCallback(
    (salesPersonName: string | null) => {
      // console.log(
      //   'handleSalesPersonSelect in Analytics called with:',
      //   salesPersonName
      // );
      setSelectedSalesPerson(salesPersonName);
      if (!salesPersonName) {
        setFullChart('period');
      }
    },
    []
  );

  const selectedYear = startPeriod ? format(startPeriod, 'yyyy') : undefined;
  const selectedMonth = startPeriod ? format(startPeriod, 'MM') : undefined;

  return (
    <div className='flex flex-col h-screen w-full p-4 gap-4'>
      <section className='rounded-lg bg-white shadow-sm border border-muted-200 p-4 flex flex-col gap-4'>
        <SalesInvoiceFilterSummary />
        <HeaderPeriodFilterSection
          onPeriodChange={async ({ startPeriod, endPeriod }) => {
            // console.log('onPeriodChange called with:', {
            //   startPeriod,
            //   endPeriod,
            // });
            setIsLoading(true);
            try {
              // Contoh: await fetchSalesData(startPeriod, endPeriod);
            } catch (error) {
              toast({
                description: 'Gagal memuat data untuk periode yang dipilih.',
                color: 'destructive',
              });
            } finally {
              setIsLoading(false);
            }
          }}
        />
      </section>

      <section
        className={`w-full gap-4 ${fullChart === 'period' ? '' : 'grid grid-cols-1 md:grid-cols-2'}`}
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
              year={selectedYear}
              month={selectedMonth}
              onClose={() => {
                // console.log('TopProductSoldBySalesPerson onClose called');
                setSelectedSalesPerson(null);
                setFullChart('period');
              }}
            />
          </motion.div>
        )}
      </section>

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

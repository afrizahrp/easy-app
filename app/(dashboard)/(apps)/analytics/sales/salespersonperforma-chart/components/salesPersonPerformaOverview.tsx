'use client';
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import SalesBySalesPersonFilteredChart from './salesBySalesPersonFilteredChart';
import SalesBySalesPersonUnFilteredChart from './salesBySalesPersonUnFilteredChart';
import { useSalesInvoiceHdFilterStore, useMonthYearPeriodStore } from '@/store';
import { useToast } from '@/components/ui/use-toast';
import { startOfMonth, isEqual } from 'date-fns';

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
}

interface SalesPersonPerformaOverviewProps {
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (salesPersonName: string | null) => void;
}

const SalesPersonPerformaOverview: React.FC<
  SalesPersonPerformaOverviewProps
> = ({ isFullWidth = true, onModeChange, onSalesPersonSelect }) => {
  const { salesPersonName, setSalesPersonName } = useSalesInvoiceHdFilterStore(
    (state) => ({
      salesPersonName: state.salesPersonName,
      setSalesPersonName: state.setSalesPersonName,
    })
  );

  const { startPeriod, endPeriod, setStartPeriod, setEndPeriod } =
    useMonthYearPeriodStore();
  const { toast } = useToast();

  const validSalesPersonNames = Array.isArray(salesPersonName)
    ? salesPersonName.filter((name) => typeof name === 'string' && name.trim())
    : salesPersonName && typeof salesPersonName === 'string' && salesPersonName
      ? [salesPersonName]
      : [];

  const handleSalesPersonSelect = useCallback(
    (selection: SalesPersonSelection | null) => {
      console.log(
        'handleSalesPersonSelect called with:',
        selection,
        'Current validSalesPersonNames:',
        validSalesPersonNames
      );
      if (selection) {
        const { salesPersonName, year, month } = selection;
        if (
          !salesPersonName ||
          typeof salesPersonName !== 'string' ||
          !salesPersonName.trim()
        ) {
          toast({
            description: 'Nama salesperson tidak valid.',
            color: 'destructive',
          });
          return;
        }
        if (!validSalesPersonNames.includes(salesPersonName)) {
          console.log('Updating salesPersonName to:', [salesPersonName]);
          setSalesPersonName([salesPersonName]);
        }
        if (year && month) {
          try {
            const yearNum = parseInt(year);
            const monthNum = parseInt(month) - 1;
            if (
              isNaN(yearNum) ||
              isNaN(monthNum) ||
              monthNum < 0 ||
              monthNum > 11
            ) {
              throw new Error('Invalid year or month');
            }
            const newDate = startOfMonth(new Date(yearNum, monthNum, 1));
            if (!startPeriod || !isEqual(startPeriod, newDate)) {
              console.log('Updating startPeriod to:', newDate);
              setStartPeriod(newDate);
              setEndPeriod(null);
            }
          } catch (error) {
            toast({
              description: 'Gagal mengatur periode.',
              color: 'destructive',
            });
            console.error('Failed to set period:', error);
          }
        }
        console.log('Calling onSalesPersonSelect with:', salesPersonName);
        onSalesPersonSelect?.(salesPersonName);
      } else {
        if (validSalesPersonNames.length > 0) {
          console.log('Resetting salesPersonName');
          setSalesPersonName([]);
        }
        if (startPeriod || endPeriod) {
          console.log('Resetting period');
          setStartPeriod(null);
          setEndPeriod(null);
        }
        console.log('Calling onSalesPersonSelect with null');
        onSalesPersonSelect?.(null);
      }
    },
    [
      validSalesPersonNames,
      startPeriod,
      endPeriod,
      setSalesPersonName,
      setStartPeriod,
      setEndPeriod,
      onSalesPersonSelect,
      toast,
    ]
  );

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className='w-full'
    >
      {/* Chart dikomentari untuk debugging */}
      {validSalesPersonNames.length > 0 ? (
        <SalesBySalesPersonFilteredChart
          isFullWidth={isFullWidth}
          onModeChange={onModeChange}
          onSalesPersonSelect={handleSalesPersonSelect}
        />
      ) : (
        <SalesBySalesPersonUnFilteredChart
          isFullWidth={isFullWidth}
          onModeChange={onModeChange}
          onSalesPersonSelect={handleSalesPersonSelect}
        />
      )}
      {/* <div>Dummy Chart</div> Placeholder sementara */}
    </motion.div>
  );
};

export default React.memo(SalesPersonPerformaOverview);

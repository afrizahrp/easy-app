'use client';
import React from 'react';
import { motion } from 'framer-motion';
import SalesBySalesPersonFilteredChart from './salesBySalesPersonFilteredChart/page';
import SalesBySalesPersonUnFilteredChart from './salesBySalesPersonUnFilteredChart/page';
import { useSalesInvoiceHdFilterStore } from '@/store';

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
}

interface SalesPersonPerformaChartProps {
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (selection: SalesPersonSelection | null) => void;
}

const SalesPersonPerformaChart: React.FC<SalesPersonPerformaChartProps> = ({
  isFullWidth = true,
  onModeChange,
  onSalesPersonSelect,
}) => {
  const { salesPersonName, setSalesPersonName } = useSalesInvoiceHdFilterStore(
    (state) => ({
      salesPersonName: state.salesPersonName,
      setSalesPersonName: state.setSalesPersonName,
    })
  );

  const handleSalesPersonSelect = (selection: SalesPersonSelection | null) => {
    console.log('handleSalesPersonSelect in PerformaChart:', selection);
    if (selection) {
      if (!salesPersonName.includes(selection.salesPersonName)) {
        setSalesPersonName([selection.salesPersonName]);
      }
      onSalesPersonSelect?.(selection);
    } else {
      setSalesPersonName([]);
      onSalesPersonSelect?.(null);
    }
  };

  const validSalesPersonNames = Array.isArray(salesPersonName)
    ? salesPersonName.filter((name) => typeof name === 'string' && name.trim())
    : salesPersonName && typeof salesPersonName === 'string' && salesPersonName
      ? [salesPersonName]
      : [];

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className='w-full'
    >
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
    </motion.div>
  );
};

export default SalesPersonPerformaChart;

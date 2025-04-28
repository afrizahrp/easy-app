'use client';
import React from 'react';
import SalesBySalesPersonFilteredChart from './salesBySalesPersonFilteredChart/page';
import SalesBySalesPersonUnFilteredChart from './salesBySalesPersonUnFilteredChart/page';
import { useSalesInvoiceHdFilterStore } from '@/store';

interface SalesPersonPerformaChartProps {
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (
    selection: { salesPersonName: string; month: string } | null
  ) => void;
}

const SalesPersonPerformaChart: React.FC<SalesPersonPerformaChartProps> = ({
  isFullWidth = true,
  onModeChange,
  onSalesPersonSelect,
}) => {
  const { salesPersonName } = useSalesInvoiceHdFilterStore((state) => ({
    salesPersonName: state.salesPersonName,
  }));

  // Validasi salesPersonName
  const validSalesPersonNames = Array.isArray(salesPersonName)
    ? salesPersonName.filter((name) => typeof name === 'string' && name.trim())
    : salesPersonName && typeof salesPersonName === 'string' && salesPersonName
      ? [salesPersonName]
      : [];

  if (validSalesPersonNames.length > 0) {
    return (
      <SalesBySalesPersonFilteredChart
        isFullWidth={isFullWidth}
        onModeChange={onModeChange}
        onSalesPersonSelect={onSalesPersonSelect}
      />
    );
  }

  return (
    <SalesBySalesPersonUnFilteredChart
      isFullWidth={isFullWidth}
      onModeChange={onModeChange}
    />
  );
};

export default SalesPersonPerformaChart;

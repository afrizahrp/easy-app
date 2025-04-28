'use client';
import React from 'react';
import SalesBySalesPersonFilteredChart from '../salesPersonPerformaChart/salesBySalesPersonFilteredChart/page';
import SalesBySalesPersonUnFilteredChart from '../salesPersonPerformaChart/salesBySalesPersonUnFilteredChart/page';
import { useSalesInvoiceHdFilterStore } from '@/store';

interface SalesPersonPerformaChartProps {
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (
    selection: {
      salesPersonName: string;
      year: string;
      month: string;
    } | null
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

  // Validasi salesPersonName untuk memastikan hanya nama valid yang digunakan
  const validSalesPersonNames = Array.isArray(salesPersonName)
    ? salesPersonName.filter((name) => typeof name === 'string' && name.trim())
    : salesPersonName && typeof salesPersonName === 'string' && salesPersonName
      ? [salesPersonName]
      : [];

  // Jika ada lebih dari satu sales person yang valid, gunakan chart filtered
  if (validSalesPersonNames.length > 0) {
    return (
      <SalesBySalesPersonFilteredChart
        isFullWidth={isFullWidth}
        onModeChange={onModeChange}
        onSalesPersonSelect={onSalesPersonSelect}
      />
    );
  }

  // Jika tidak ada sales person yang valid atau hanya satu, gunakan chart unfiltered
  return (
    <SalesBySalesPersonUnFilteredChart
      isFullWidth={isFullWidth}
      onModeChange={onModeChange}
    />
  );
};

export default SalesPersonPerformaChart;

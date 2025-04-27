'use client';
import React from 'react';
import SalesBySalesPersonFilteredChart from './salesBySalesPersonFilteredChart/page';
import SalesBySalesPersonUnFilteredChart from './salesBySalesPersonUnFilteredChart/page';

interface SalesBySalesPersonByPeriodChartProps {
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  salesPersonNames?: string[];
}

const SalesBySalesPersonByPeriodChart: React.FC<
  SalesBySalesPersonByPeriodChartProps
> = ({ isFullWidth = false, onModeChange, salesPersonNames }) => {
  if (salesPersonNames && salesPersonNames.length > 0) {
    return (
      <SalesBySalesPersonFilteredChart
        isFullWidth={isFullWidth}
        onModeChange={onModeChange}
        salesPersonNames={salesPersonNames}
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

export default SalesBySalesPersonByPeriodChart;

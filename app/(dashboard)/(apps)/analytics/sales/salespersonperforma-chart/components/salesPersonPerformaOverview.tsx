'use client';
import React, { useState } from 'react';
import { useSalesInvoiceHdFilterStore } from '@/store';
import MonthlySalesPersonInvoiceChart from './monthlySalesPersonInvoiceChart';
import MonthlySalesPersonInvoiceChartChart from './monthlySalesPersonInvoiceFilteredChart';

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
  color?: string;
}

interface SalesPersonPerformaOverviewProps {
  showFloatingButton?: boolean;
  showList?: boolean;
  isFullWidth?: boolean;
  startPeriod?: string;
  endPeriod?: string;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (selection: SalesPersonSelection | null) => void;
}

const SalesPersonPerformaOverview: React.FC<
  SalesPersonPerformaOverviewProps
> = ({
  showFloatingButton,
  showList = true,
  isFullWidth = true,
  startPeriod,
  endPeriod,
  onModeChange,
  onSalesPersonSelect,
}) => {
  const { salesPersonInvoiceFilters, setSalesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore((state) => ({
      salesPersonInvoiceFilters: state.salesPersonInvoiceFilters,
      setSalesPersonInvoiceFilters: state.setSalesPersonInvoiceFilters,
    }));

  const salesPersonName = salesPersonInvoiceFilters.salesPersonName;

  const validSalesPersonNames = Array.isArray(
    salesPersonInvoiceFilters.salesPersonName
  )
    ? salesPersonInvoiceFilters.salesPersonName.filter(
        (name) => typeof name === 'string' && name.trim()
      )
    : salesPersonInvoiceFilters.salesPersonName &&
        typeof salesPersonInvoiceFilters.salesPersonName === 'string' &&
        salesPersonInvoiceFilters.salesPersonName
      ? [salesPersonInvoiceFilters.salesPersonName]
      : [];

  const [isFullWidthState, setIsFullWidthState] = useState(false);

  const handleSalesPersonSelect = (selection: SalesPersonSelection | null) => {
    if (selection) {
      if (!salesPersonName.includes(selection.salesPersonName)) {
        setSalesPersonInvoiceFilters({
          ...salesPersonInvoiceFilters,
          salesPersonName: [selection.salesPersonName],
        });
      }
      onSalesPersonSelect?.(selection);
    } else {
      if (salesPersonName.length > 0) {
        setSalesPersonInvoiceFilters({
          ...salesPersonInvoiceFilters,
          salesPersonName: [],
        });
      }
      onSalesPersonSelect?.(null);
    }
  };

  return (
    <div
      className={`flex flex-col w-full p-2 gap-4 ${showList ? 'h-fit' : 'h-fit min-h-0'}`}
    >
      <div className='w-full'>
        {validSalesPersonNames.length > 0 ? (
          <MonthlySalesPersonInvoiceChartChart
            key={`filtered-${validSalesPersonNames.join('-')}`}
            isFullWidth={isFullWidth}
            onModeChange={onModeChange}
            onSalesPersonSelect={handleSalesPersonSelect}
          />
        ) : (
          <div className='w-full overflow-x-auto max-w-full h-fit min-h-0'>
            <MonthlySalesPersonInvoiceChart
              isFullWidth={isFullWidth}
              height={showList ? 400 : 300}
              isCompact={!showList}
              onModeChange={setIsFullWidthState}
              onSalesPersonSelect={handleSalesPersonSelect}
              startPeriod={startPeriod}
              endPeriod={endPeriod}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPersonPerformaOverview;

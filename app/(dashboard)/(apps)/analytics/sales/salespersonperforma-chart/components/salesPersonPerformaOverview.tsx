'use client';
import React, { useState } from 'react';
import MonthlySalesPersonInvoiceChart from './monthlySalesPersonInvoiceChart';
import SelectedSalesPersonInvoice from './selectedSalesPersonInvoice';
import { useSalesInvoiceHdFilterStore } from '@/store';

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
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (selection: SalesPersonSelection | null) => void;
}

const SalesPersonPerformaOverview: React.FC<
  SalesPersonPerformaOverviewProps
> = ({
  showFloatingButton,
  showList = true,
  isFullWidth = true,
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
          <SelectedSalesPersonInvoice
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
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPersonPerformaOverview;

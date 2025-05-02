'use client';
import React, { useState } from 'react';
import SalesBySalesPersonFilteredChart from './salesBySalesPersonFilteredChart';
import SalesBySalesPersonUnFilteredChart from './salesBySalesPersonUnFilteredChart';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { FloatingFilterButton } from '@/components/ui/floating-filter-button';

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
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
  const { salesPersonName, setSalesPersonName } = useSalesInvoiceHdFilterStore(
    (state) => ({
      salesPersonName: state.salesPersonName,
      setSalesPersonName: state.setSalesPersonName,
    })
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullWidthState, setIsFullWidthState] = useState(false);

  const handleSalesPersonSelect = (selection: SalesPersonSelection | null) => {
    if (selection) {
      // Hanya perbarui jika salesPersonName berbeda
      if (!salesPersonName.includes(selection.salesPersonName)) {
        setSalesPersonName([selection.salesPersonName]);
      }
      onSalesPersonSelect?.(selection);
    } else {
      // Hanya reset jika salesPersonName tidak kosong
      if (salesPersonName.length > 0) {
        setSalesPersonName([]);
      }
      onSalesPersonSelect?.(null);
    }
  };

  const validSalesPersonNames = Array.isArray(salesPersonName)
    ? salesPersonName.filter((name) => typeof name === 'string' && name.trim())
    : salesPersonName && typeof salesPersonName === 'string' && salesPersonName
      ? [salesPersonName]
      : [];

  return (
    <div
      className={`flex flex-col w-full p-2 gap-4 ${showList ? 'h-fit' : 'h-fit min-h-0'}`}
    >
      {showFloatingButton && (
        <FloatingFilterButton
          onClick={() => setIsSidebarOpen(true)}
          showFloatingButton={true}
        />
      )}
      <div className='w-full'>
        {validSalesPersonNames.length > 0 ? (
          <SalesBySalesPersonFilteredChart
            key={`filtered-${validSalesPersonNames.join('-')}`}
            isFullWidth={isFullWidth}
            onModeChange={onModeChange}
            onSalesPersonSelect={handleSalesPersonSelect}
          />
        ) : (
          <div className='w-full overflow-x-auto max-w-full h-fit min-h-0'>
            <SalesBySalesPersonUnFilteredChart
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

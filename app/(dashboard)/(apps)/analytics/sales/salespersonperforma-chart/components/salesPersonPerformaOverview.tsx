'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import SalesBySalesPersonFilteredChart from './salesBySalesPersonFilteredChart';
import SalesBySalesPersonUnFilteredChart from './salesBySalesPersonUnFilteredChart';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { FloatingFilterButton } from '@/components/ui/floating-filter-button';
import { PageHeaderWrapper } from '@/components/page-header-wrapper';
import SalesPersonInvoiceList from '@/app/(dashboard)/(apps)/sales/salespersonInvoice/list/page';

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
  initialCompact?: boolean;
}

const SalesPersonPerformaOverview: React.FC<
  SalesPersonPerformaOverviewProps
> = ({
  showFloatingButton,
  showList = true,
  isFullWidth = true,
  onModeChange,
  onSalesPersonSelect,
  initialCompact = true,
}) => {
  const { salesPersonName, setSalesPersonName } = useSalesInvoiceHdFilterStore(
    (state) => ({
      salesPersonName: state.salesPersonName,
      setSalesPersonName: state.setSalesPersonName,
    })
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDetailedView, setIsDetailedView] = useState(false); // State untuk View Details

  const handleSalesPersonSelect = (selection: SalesPersonSelection | null) => {
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
    <div
      className={`flex flex-col w-full p-2 gap-4 ${showList ? 'h-screen' : 'h-fit min-h-0'}`}
    >
      <div className='w-full'>
        {showFloatingButton && (
          <FloatingFilterButton
            onClick={() => setIsSidebarOpen(true)}
            showFloatingButton={true}
          />
        )}
        {/* <div className='flex justify-between items-center mb-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsDetailedView(!isDetailedView)}
          >
            {isDetailedView ? 'Back to Compact' : 'View Details'}
          </Button>
        </div> */}
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
              key='unfiltered'
              // isCompact={initialCompact && !isDetailedView} // Compact kecuali View Details
              isFullScreen={isFullScreen}
              height={250}
              isCompact={true}
              onModeChange={setIsFullScreen}
              onSalesPersonSelect={handleSalesPersonSelect}
            />
          </div>
        )}
        {showList && (
          <div className='w-full flex-1'>
            <PageHeaderWrapper title='Invoice List' />
            <SalesPersonInvoiceList />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPersonPerformaOverview;

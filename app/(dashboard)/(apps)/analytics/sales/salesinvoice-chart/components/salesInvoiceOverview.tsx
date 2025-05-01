// analytics/sales/salesinvoice-chart/components/SalesInvoiceOverview.tsx
'use client';

import SalesByPeriod from './salesInvoiceByPeriodChart';
import SalesByPoType from './salesInvoiceByPoTypeChart';
import SalesInvoiceHdList from '@/app/(dashboard)/(apps)/sales/invoice-hd/list/page';
import { PageHeaderWrapper } from '@/components/page-header-wrapper';
import { useState } from 'react';
import { GeneralInvoiceFilterSidebar } from '@/components/FilterSidebarButton/sales/generalnvoiceFilterSidebar';
import { FloatingFilterButton } from '@/components/ui/floating-filter-button';

interface SalesInvoiceOverviewProps {
  showList?: boolean;
  showFloatingButton?: boolean;
  fullChart?: 'period' | 'poType' | null;
  onFilterChange?: (filters: { period?: string; poType?: string }) => void;
}

const SalesInvoiceOverview: React.FC<SalesInvoiceOverviewProps> = ({
  showList = true,
  showFloatingButton = true,
  fullChart = null,
  onFilterChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chartLayoutClass = 'flex flex-col md:flex-row w-full gap-4';
  const chartWidthClass = (isFull: boolean) =>
    isFull ? 'w-full' : 'w-full md:w-1/2';

  return (
    <div className='relative flex flex-col h-screen w-full p-2 gap-4'>
      {showFloatingButton && (
        <FloatingFilterButton
          onClick={() => setIsSidebarOpen(true)}
          showFloatingButton={true}
        />
      )}
      {/* {isSidebarOpen && (
        <GeneralInvoiceFilterSidebar
          onClose={() => setIsSidebarOpen(false)}
          onFilterChange={onFilterChange}
        />
      )} */}

      {showList ? (
        <div className={chartLayoutClass}>
          {(fullChart === null || fullChart === 'period') && (
            <div
              className={`${chartWidthClass(fullChart === 'period')} overflow-x-auto max-w-full`}
            >
              <SalesByPeriod
                isFullWidth={fullChart === 'period'}
                onModeChange={(isFull) =>
                  onFilterChange?.({ period: isFull ? 'full' : undefined })
                }
              />
            </div>
          )}
          {(fullChart === null || fullChart === 'poType') && (
            <div
              className={`${chartWidthClass(fullChart === 'poType')} overflow-x-auto max-w-full`}
            >
              <SalesByPoType
                isFullWidth={fullChart === 'poType'}
                onModeChange={(isFull) =>
                  onFilterChange?.({ poType: isFull ? 'full' : undefined })
                }
              />
            </div>
          )}
        </div>
      ) : (
        <div className='w-full overflow-x-auto max-w-full'>
          <SalesByPeriod
            isFullWidth={false}
            onModeChange={(isFull) =>
              onFilterChange?.({ period: isFull ? 'full' : undefined })
            }
          />
        </div>
      )}

      {showList && (
        <div className='w-full flex-1'>
          <PageHeaderWrapper title='Invoice List' />
          <SalesInvoiceHdList />
        </div>
      )}
    </div>
  );
};

export default SalesInvoiceOverview;

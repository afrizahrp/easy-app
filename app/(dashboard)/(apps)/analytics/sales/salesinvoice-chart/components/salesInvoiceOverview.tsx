'use client';

import SalesInvoiceByPeriodChart from './salesInvoiceByPeriodChart';
import SalesInvoiceByPoTypeChart from './salesInvoiceByPoTypeChart';
import SalesInvoiceHdList from '@/app/(dashboard)/(apps)/sales/invoice-hd/list/page';
import { PageHeaderWrapper } from '@/components/page-header-wrapper';
import { useState } from 'react';

interface SalesInvoiceOverviewProps {
  showFloatingButton?: boolean;
  showList?: boolean;
  fullChart?: 'period' | 'poType' | null;
  onFilterChange?: (filters: { period?: string; poType?: string }) => void;
}

const SalesInvoiceOverview: React.FC<SalesInvoiceOverviewProps> = ({
  showFloatingButton = true,
  showList = true,
  fullChart = null,
  onFilterChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chartLayoutClass =
    'flex flex-col md:flex-row w-full gap-4 items-stretch';
  const chartWidthClass = (isFull: boolean) =>
    isFull ? 'w-full' : 'w-full md:w-1/2';

  return (
    <div
      className={`flex flex-col w-full p-2 gap-4 ${showList ? 'h-screen' : 'h-fit min-h-0'}`}
    >
      {showList ? (
        <div className={chartLayoutClass}>
          {(fullChart === null || fullChart === 'period') && (
            <div
              className={`${chartWidthClass(fullChart === 'period')} overflow-x-auto max-w-full`}
            >
              <SalesInvoiceByPeriodChart
                isFullWidth={fullChart === 'period'}
                onModeChange={(isFull) =>
                  onFilterChange?.({ period: isFull ? 'full' : undefined })
                }
                height={400}
                isCompact={false}
              />
            </div>
          )}
          {(fullChart === null || fullChart === 'poType') && (
            <div
              className={`${chartWidthClass(fullChart === 'poType')} overflow-x-auto max-w-full`}
            >
              <SalesInvoiceByPoTypeChart
                isFullWidth={fullChart === 'poType'}
                onModeChange={(isFull) =>
                  onFilterChange?.({ poType: isFull ? 'full' : undefined })
                }
                height={400}
                isCompact={false}
              />
            </div>
          )}
        </div>
      ) : (
        <div className='w-full overflow-x-auto max-w-full h-fit min-h-0'>
          {/* <SalesInvoiceByPeriodChart
            isFullWidth={false}
            onModeChange={(isFull) =>
              onFilterChange?.({ period: isFull ? 'full' : undefined })
            }
            height={300}
            isCompact={true}
          /> */}

          <SalesInvoiceByPoTypeChart
            isFullWidth={fullChart === 'poType'}
            onModeChange={(isFull) =>
              onFilterChange?.({ poType: isFull ? 'full' : undefined })
            }
            height={300}
            isCompact={true}
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

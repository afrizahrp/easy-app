// analytics/sales/salesinvoice-chart/components/SalesInvoiceOverview.tsx
'use client';

import SalesByPeriod from './salesInvoiceByPeriodChart';
import SalesByPoType from './salesInvoiceByPoTypeChart';
import SalesInvoiceHdList from '@/app/(dashboard)/(apps)/sales/invoice-hd/list/page';
import { PageHeaderWrapper } from '@/components/page-header-wrapper';
import { useEffect, useState } from 'react';
import { GeneralInvoiceFilterSidebar } from '@/components/FilterSidebarButton/sales/generalnvoiceFilterSidebar';
import SalesInvoiceByPoTypeChart from './salesInvoiceByPoTypeChart';
import SalesInvoiceByPeriodChart from './salesInvoiceByPeriodChart';

interface SalesInvoiceOverviewProps {
  showList?: boolean;
  fullChart?: 'period' | 'poType' | null;
  onFilterChange?: (filters: { period?: string; poType?: string }) => void;
}

const SalesInvoiceOverview: React.FC<SalesInvoiceOverviewProps> = ({
  showList = true,
  fullChart = null,
  onFilterChange,
}) => {
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('filterButtonPosition');
    if (saved) setButtonPosition(JSON.parse(saved));
  }, []);

  // Tentukan tata letak untuk chart (hanya digunakan saat showList={true})
  const chartLayoutClass = 'flex flex-col md:flex-row w-full gap-4';

  // Tentukan class lebar untuk chart (hanya digunakan saat showList={true})
  const chartWidthClass = (isFull: boolean) =>
    isFull ? 'w-full' : 'w-full md:w-1/2';

  return (
    <div className='relative flex flex-col h-screen w-full p-2 gap-4'>
      {/* Bagian Chart */}
      {showList ? (
        // Di halaman utama (showList={true}), tampilkan kedua chart secara horizontal
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
              <SalesInvoiceByPoTypeChart
                isFullWidth={fullChart === 'poType'}
                onModeChange={(isFull) =>
                  onFilterChange?.({ poType: isFull ? 'full' : undefined })
                }
              />
            </div>
          )}
        </div>
      ) : (
        // Di SalesPage (showList={false}), hanya tampilkan SalesByPeriod
        <div className='w-full overflow-x-auto max-w-full'>
          <SalesInvoiceByPeriodChart
            isFullWidth={false} // Tidak perlu full width di SalesPage
            onModeChange={(isFull) =>
              onFilterChange?.({ period: isFull ? 'full' : undefined })
            }
          />
        </div>
      )}

      {/* Bagian Table */}
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

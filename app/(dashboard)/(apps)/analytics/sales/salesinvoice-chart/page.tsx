// app/analytics/sales/salesinvoice-chart/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import SalesInvoiceFilterSummary from '@/components/sales/salesInvoiceFilterSummary';
import SalesInvoiceOverview from '../salesinvoice-chart/components/salesInvoiceOverview';
import { GeneralInvoiceFilterSidebar } from '@/components/FilterSidebarButton/sales/generalnvoiceFilterSidebar';
import Draggable from 'react-draggable';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { PageHeaderWrapper } from '@/components/page-header-wrapper';

interface SalesInvoiceAnalyticsProps {
  showList?: boolean;
  showHeader?: boolean; // Prop baru
}

const SalesInvoiceAnalytics: React.FC<SalesInvoiceAnalyticsProps> = ({
  showList = true,
  showHeader = true, // Default true
}) => {
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fullChart, setFullChart] = useState<'period' | 'poType' | null>(null);

  const handleFilterChange = (filters: {
    period?: string;
    poType?: string;
  }) => {
    if (filters.period === 'full') {
      setFullChart('period');
    } else if (filters.poType === 'full') {
      setFullChart('poType');
    } else {
      setFullChart(null);
    }
  };

  useEffect(() => {
    localStorage.setItem(
      'filterButtonPosition',
      JSON.stringify(buttonPosition)
    );
  }, [buttonPosition]);

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setButtonPosition({ x: data.x, y: data.y });
  };

  const dummyTable = {
    getState: () => ({
      columnFilters: [],
      sorting: [],
      pagination: { pageIndex: 0, pageSize: 10 },
      globalFilter: '',
      rowSelection: {},
    }),
    getColumn: () => undefined,
    getFilteredRowModel: () => ({ rows: [] }),
    resetColumnFilters: () => {},
    setColumnFilters: () => {},
  } as unknown as Table<any>;

  return (
    <div className='relative flex flex-col h-screen w-full p-4 gap-4'>
      <Draggable
        defaultPosition={{ x: 0, y: 0 }}
        position={buttonPosition}
        onDrag={handleDrag}
      >
        <div
          className='fixed bottom-4 right-4 z-50'
          style={{
            transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
          }}
        >
          <Button
            size='sm'
            onClick={() => setIsSidebarOpen(true)}
            className='px-3 h-8 flex items-center gap-1 bg-primary text-white hover:bg-secondary-dark rounded-full hover:scale-105 transition-transform cursor-move shadow-md'
          >
            <Filter className='w-4 h-4' />
            Filter
          </Button>
        </div>
      </Draggable>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent className='pt-5 w-80 sm:w-96'>
          <SheetTitle>Filter Data</SheetTitle>
          <GeneralInvoiceFilterSidebar table={dummyTable} />
        </SheetContent>
      </Sheet>

      <PageHeaderWrapper
        show={showHeader}
        title='Sales Invoice Analytics'
        hideBreadcrumb={false}
        breadcrumb={[
          { name: 'Analytics', href: '/analytics/sales' },
          {
            name: 'Sales Invoice Analytics',
            href: '/analytics/sales/salesinvoice-chart',
          },
        ]}
      />
      <div className='flex-1 min-w-[200px]'>
        <SalesInvoiceFilterSummary />
      </div>

      <SalesInvoiceOverview
        showList={showList}
        fullChart={fullChart}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default SalesInvoiceAnalytics;

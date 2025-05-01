// analytics/sales/page.tsx
'use client';
import SalesInvoiceAnalytics from './salesinvoice-chart/page';
import SalesPersonPerformaAnalytics from './salespersonperforma-chart/page';
import PageHeaderWrapper from '@/components/page-header-wrapper';

export default function SalesAnalytics() {
  return (
    <div className='flex flex-col h-screen w-full p-2 gap-4'>
      <div className='bg-white dark:bg-inherit p-4 rounded-lg shadow-sm'>
        <PageHeaderWrapper show={false} />
        <SalesPersonPerformaAnalytics showList={false} />

        <div className='bg-white dark:bg-inherit p-2 rounded-lg shadow-sm'>
          <PageHeaderWrapper show={false} />
          <SalesInvoiceAnalytics />
        </div>
      </div>
    </div>
  );
}

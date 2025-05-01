// analytics/sales/page.tsx
'use client';
import Link from 'next/link';
import AnalyticsNav from '@/components/AnalyticsNav';
import SalesInvoiceAnalytics from './salesinvoice-chart/page';
import SalesPersonPerformaAnalytics from './salespersonperforma-chart/page';
import PageHeaderWrapper from '@/components/page-header-wrapper';

export default function SalesAnalytics() {
  return (
    <div className='flex flex-col h-screen w-full p-2 gap-4'>
      {/* <AnalyticsNav /> */}
      <h1 className='text-2xl font-bold mb-4'>Sales Analytics</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-white dark:bg-inherit p-4 rounded-lg shadow-sm'>
          {/* <h2 className='text-lg font-semibold mb-2'>
            Salesperson Performance
          </h2> */}

          <PageHeaderWrapper show={false} />

          <SalesPersonPerformaAnalytics showList={false} />
        </div>
        <div className='bg-white dark:bg-inherit p-2 rounded-lg shadow-sm'>
          {/* <h2 className='text-lg font-semibold mb-2'>Sales Invoice Overview</h2> */}
          <SalesInvoiceAnalytics />
        </div>
      </div>
      {/* <Link
        href='/analytics/sales/salesinvoice-chart'
        className='text-blue-600 hover:underline'
      >
        View Detailed Invoice Analytics
      </Link> */}
    </div>
  );
}

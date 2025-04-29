// analytics/sales/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import SalesPersonPerformaAnalytics from './SalesPersonPerformaAnalytics';
import SalesInvoiceOverview from './salesinvoice-chart/components/salesInvoiceOverview';
import AnalyticsNav from '@/components/AnalyticsNav';

export default function SalesPage() {
  return (
    <div className='flex flex-col h-screen w-full p-4 gap-4'>
      <AnalyticsNav />
      <h1 className='text-2xl font-bold mb-4'>Sales Analytics</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <h2 className='text-lg font-semibold mb-2'>
            Salesperson Performance
          </h2>
          <SalesPersonPerformaAnalytics />
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <h2 className='text-lg font-semibold mb-2'>Sales Invoice Overview</h2>
          <SalesInvoiceOverview isFullWidth={false} />
        </div>
      </div>
      <Link
        href='/analytics/sales/salesinvoice-chart'
        className='text-blue-600 hover:underline'
      >
        View Detailed Invoice Analytics
      </Link>
    </div>
  );
}

// analytics/sales/salesinvoice-chart/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import SalesInvoiceOverview from './components/salesInvoiceOverview';
// import AnalyticsNav from '@/components/AnalyticsNav'; // Opsional untuk navigasi

export default function SalesInvoiceAnalytics() {
  const [isFullWidth, setIsFullWidth] = useState(true);

  const handleFilterChange = (filters: {
    period?: string;
    poType?: string;
  }) => {
    console.log('Filter changed:', filters);
    // Tambahkan logika jika perlu, misalnya update state atau fetch data baru
  };

  return (
    <div className='flex flex-col h-screen w-full p-4 gap-4'>
      {/* Navigasi manual atau komponen navigasi */}
      <AnalyticsNav /> {/* Atau gunakan navigasi inline */}
      {/* <nav className="mb-4">
        <Link href="/analytics" className="text-blue-600 hover:underline">Dashboard</Link>
        <Link href="/analytics/sales" className="ml-4 text-blue-600 hover:underline">Sales</Link>
      </nav> */}
      <h1 className='text-2xl font-bold mb-4'>Sales Invoice Analytics</h1>
      <SalesInvoiceOverview
        fullChart={isFullWidth}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}

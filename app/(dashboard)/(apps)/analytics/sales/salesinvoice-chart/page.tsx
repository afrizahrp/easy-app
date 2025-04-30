// analytics/sales/salesinvoice-chart/page.tsx
'use client';
import { useState } from 'react';
import AnalyticsNav from '@/components/AnalyticsNav';
import SalesInvoiceOverview from '../salesinvoice-chart/components/salesInvoiceOverview';

export default function SalesInvoiceAnalytics() {
  const [fullChart, setFullChart] = useState<'period' | 'poType' | null>(null);

  const handleFilterChange = (filters: {
    period?: string;
    poType?: string;
  }) => {
    console.log('Filter changed:', filters);
    if (filters.period === 'full') {
      setFullChart('period');
    } else if (filters.poType === 'full') {
      setFullChart('poType');
    } else {
      setFullChart(null);
    }
  };

  return (
    <div className='flex flex-col h-screen w-full p-4 gap-4'>
      <AnalyticsNav />
      <h1 className='text-2xl font-bold mb-4'>Sales Invoice Analytics</h1>
      <SalesInvoiceOverview
        fullChart={fullChart}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}

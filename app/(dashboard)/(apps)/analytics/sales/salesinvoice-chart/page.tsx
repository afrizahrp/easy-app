// analytics/sales/salesinvoice-chart/page.tsx
'use client';
import { useState } from 'react';
import SalesInvoiceOverview from '../salesinvoice-chart/components/salesInvoiceOverview';

const SalesInvoiceAnalytics = () => {
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
    <div className='relative flex flex-col h-screen w-full p-4 gap-4'>
      <SalesInvoiceOverview
        showList={true}
        fullChart={fullChart}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default SalesInvoiceAnalytics;

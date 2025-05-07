'use client';
import React, { useState } from 'react';
// import { useSession } from 'next-auth/react';
import { useSessionStore } from '@/store';
import { FloatingFilterButton } from '@/components/ui/floating-filter-button';
import { ChartYearFilter } from '@/components/ui/chartYearFilter';
import YearlySalesInvoiceChart from './components/yearlySalesInvoiceChart';
import YearlySalesPersonInvoiceChart from './components/yearlySalesPersonInvoiceChart';

interface DashboardPageViewProps {
  trans: {
    [key: string]: string;
  };
}
const DashboardPageView = () => {
  const { user } = useSessionStore();

  return (
    <div className='p-4'>
      <FloatingFilterButton
        title='Show Chart by Years'
        description='Show Chart by Years'
      >
        <ChartYearFilter
          title='Show Charts by Year'
          className='max-w-xs mb-6'
        />
      </FloatingFilterButton>
      <div className='grid grid-cols-2 gap-4'>
        <YearlySalesInvoiceChart
          height={400}
          isCompact={false}
          isFullWidth={false}
          onModeChange={(isFull) => console.log('Mode changed:', isFull)}
        />

        <YearlySalesPersonInvoiceChart
          // height={400}
          isCompact={false}
          isFullWidth={false}
          onModeChange={(isFull) =>
            console.log('Sales Person Mode changed:', isFull)
          }
        />
      </div>
    </div>
  );
};

export default DashboardPageView;

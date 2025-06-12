'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import SalesInvoiceFilterSummary from '@/components/sales/salesInvoiceFilterSummary';
import SalesInvoiceOverview from '../salesinvoice-chart/components/salesInvoiceOverview';
import { PageHeaderWrapper } from '@/components/page-header-wrapper';

interface SalesInvoiceAnalyticsProps {
  showList?: boolean;
  showHeader?: boolean;
  startPeriod?: string | null;
  endPeriod?: string | null;
}

const SalesInvoiceAnalytics: React.FC<SalesInvoiceAnalyticsProps> = ({
  showList = true,
  showHeader = true,
  startPeriod,
  endPeriod,
}) => {
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div
      className={`relative flex flex-col w-full p-1 gap-4 ${
        showList ? 'h-screen' : 'h-fit min-h-0'
      }`}
    >
      {showHeader && (
        <motion.div
          key={showHeader ? 'header' : 'no-header'}
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          <PageHeaderWrapper
            show={showHeader}
            title='Sales Invoice Overview'
            hideBreadcrumb={false}
            breadcrumb={[
              { name: 'Dashboard', href: '/dashboard' },
              { name: 'Analytics', href: '/analytics/sales' },
              {
                name: 'Sales Invoice Overview',
                href: '#',
              },
            ]}
          />
        </motion.div>
      )}

      <div className='flex flex-col gap-2'>
        <div className='min-w-[200px]'>
          <SalesInvoiceFilterSummary context='salesInvoice' />
        </div>

        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className='w-full'
        >
          <SalesInvoiceOverview
            showFloatingButton={showList}
            showList={showList}
            fullChart={fullChart}
            onFilterChange={handleFilterChange}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SalesInvoiceAnalytics;

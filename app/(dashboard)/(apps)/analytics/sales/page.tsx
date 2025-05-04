'use client';
import Link from 'next/link';
import { ArrowRight, BarChart2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import AnalyticsNav from '@/components/AnalyticsNav';
import SalesInvoiceAnalytics from './salesinvoice-chart/page';
import SalesPersonPerformaAnalytics from './salespersonperforma-chart/page';
import { PageHeaderWrapper } from '@/components/page-header-wrapper';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FloatingFilterButton } from '@/components/ui/floating-filter-button';
import { ChartPeriodFilterSidebar } from '@/components/FilterSidebarButton/chartPeriodFilterSidebar';

const cardVariants = {
  hidden: { opacity: 0, y: 50 }, // Tingkatkan jarak pergeseran agar lebih terlihat
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.2, // Delay berdasarkan indeks card untuk efek stagger
    },
  }),
};

// Gunakan useInView untuk memicu animasi saat elemen masuk viewport
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SalesAnalyticsPage() {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.2,
      },
    }),
  };

  const tooltipTextViewDetailsSalesInvoice =
    'Explore sales invoices to spot trends and track performance.';
  const tooltipTextViewDetailsSalesPersonPerforma =
    'Click to view detailed performance of this salesperson, including their top 3 selling products.';

  // Ref untuk masing-masing card
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const isInView1 = useInView(ref1, { once: true }); // Animasi hanya dipicu sekali saat masuk viewport
  const isInView2 = useInView(ref2, { once: true });

  return (
    <div className='flex flex-col w-full pt-2 pb-4 px-2 md:pt-4 md:pb-8 md:px-8 lg:pt-4 lg:pb-10 lg:px-10 gap-8 bg-gray-100 dark:bg-gray-900'>
      <div className='text-center md:text-left'>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-100'>
          📊 Sales Analytics
        </h1>
        <p className='text-lg text-slate-600 dark:text-slate-400 mt-2'>
          Explore sales performance and invoice summaries with interactive
          insights.
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <motion.div
          ref={ref1}
          className='bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col min-h-0 h-fit'
          custom={0} // Indeks untuk stagger
          variants={cardVariants}
          initial='hidden'
          animate={isInView1 ? 'visible' : 'hidden'}
          aria-label='Sales Invoice Overview'
          // Pindahkan efek hover ke motion.div
          whileHover={{
            y: -4,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <FileText className='w-4 h-4 text-blue-600 dark:text-blue-400' />
              <h2 className='text-xl font-semibold text-slate-400 dark:text-slate-200'>
                Sales Invoice Overview
              </h2>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant='outline'
                    size='sm'
                    className='text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700'
                  >
                    <Link
                      href='/analytics/sales/salesinvoice-chart'
                      className='flex items-center gap-1'
                    >
                      View Details
                      <ArrowRight className='w-4 h-4' />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='max-w-xs whitespace-normal text-sm'>
                  <p>{tooltipTextViewDetailsSalesInvoice}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <PageHeaderWrapper
            show={false}
            title='Sales Invoice Overview'
            hideBreadcrumb={true}
          />
          <div className='flex-1 min-h-0 overflow-hidden'>
            <SalesInvoiceAnalytics showList={false} showHeader={false} />
          </div>
        </motion.div>

        <motion.div
          ref={ref2}
          className='bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col min-h-0 h-fit'
          custom={1} // Indeks untuk stagger
          variants={cardVariants}
          initial='hidden'
          animate={isInView2 ? 'visible' : 'hidden'}
          aria-label='Salesperson Performance'
          whileHover={{
            y: -4,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <BarChart2 className='w-4 h-4 text-green-600 dark:text-green-400' />
              <h2 className='text-xl font-semibold text-slate-400 dark:text-slate-200'>
                Salesperson Performance
              </h2>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant='outline'
                    size='sm'
                    className='text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700'
                  >
                    <Link
                      href='/analytics/sales/salespersonperforma-chart'
                      className='flex items-center gap-1'
                    >
                      View Details
                      <ArrowRight className='w-4 h-4' />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='max-w-xs whitespace-normal text-sm'>
                  <p>{tooltipTextViewDetailsSalesPersonPerforma}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <PageHeaderWrapper
            show={false}
            title='Salesperson Performance'
            hideBreadcrumb={true}
          />
          <div className='flex-1 min-h-0 overflow-hidden'>
            <SalesPersonPerformaAnalytics showList={false} showHeader={false} />
          </div>
        </motion.div>

        <FloatingFilterButton>
          <ChartPeriodFilterSidebar />
        </FloatingFilterButton>
      </div>
    </div>
  );
}

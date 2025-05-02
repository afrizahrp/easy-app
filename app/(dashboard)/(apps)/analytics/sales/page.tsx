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

export default function SalesAnalyticsPage() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const tooltipTextViewDetailsSalesInvoice =
    'Explore sales invoices to spot trends and track performance.';

  const tooltipTextViewDetailsSalesPersonPerforma =
    'Click to view detailed performance of this salesperson, including their top 3 selling products.';

  return (
    <div className='flex flex-col w-full pt-2 pb-4 px-2 md:pt-4 md:pb-8 md:px-8 lg:pt-4 lg:pb-10 lg:px-10 gap-8 bg-gray-100 dark:bg-gray-900'>
      <div className='text-center md:text-left'>
        <h1
          className='text-2xl font-bold tracking-tight
         text-gray-900 dark:text-slate-100'
        >
          📊 Sales Analytics
        </h1>
        <p className='text-lg text-slate-600 dark:text-slate-400 mt-2'>
          Explore sales performance and invoice summaries with interactive
          insights.
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <motion.div
          className='bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col min-h-0 h-fit'
          variants={cardVariants}
          initial='hidden'
          animate='visible'
        >
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <FileText className='w-4 h-4 text-blue-600 dark:text-blue-400' />
              <h2
                className='text-xl font-semibold
        text-slate-400 dark:text-slate-200'
              >
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
            title=' Sales Invoice Overview'
            hideBreadcrumb={true}
          />
          <div className='flex-1 min-h-0 overflow-hidden'>
            <SalesInvoiceAnalytics showList={false} showHeader={false} />
          </div>
        </motion.div>
        <motion.div
          className='bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col min-h-0 h-fit'
          variants={cardVariants}
          initial='hidden'
          animate='visible'
        >
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <BarChart2 className='w-4 h-4 text-green-600 dark:text-green-400' />
              <h2
                className='text-xl font-semibold 
        text-slate-400 dark:text-slate-200'
              >
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
      </div>
    </div>
  );
}

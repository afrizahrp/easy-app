'use client';
import React, { useState } from 'react';
import useSalespersonFilteredSummary from '@/queryHooks/analytics/sales/useSalespersonFilteredSummary';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrency, CURRENCY } from '@/lib/utils';

interface SalespersonSummaryCardProps {
  salesPersonName: string;
  year?: string;
  currency?: string;
  isSingle?: boolean; // Prop baru untuk menentukan apakah kartu tunggal
}

const SalespersonSummaryCard: React.FC<SalespersonSummaryCardProps> = ({
  salesPersonName,
  year = '2024',
  currency = CURRENCY,
  isSingle = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Hasilkan startPeriod dan endPeriod berdasarkan year
  const startPeriod = `Jan${year}`;
  const endPeriod = `Dec${year}`;

  const { data, isLoading, error } = useSalespersonFilteredSummary({
    salesPersonName,
    startPeriod,
    endPeriod,
  });

  if (isLoading) {
    return (
      <div
        className={cn(
          'relative w-full max-w-sm h-64 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700',
          isSingle && 'mx-auto'
        )}
      >
        <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer' />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'text-red-500 bg-red-50 p-4 rounded-xl w-full max-w-sm',
          isSingle && 'mx-auto'
        )}
      >
        Error: {error.message}
      </div>
    );
  }

  if (!data || !data.totalInvoice) {
    console.log('Data tidak lengkap:', { salesPersonName, data });
    return (
      <div className={cn('w-full max-w-sm', isSingle && 'mx-auto')}>
        <Card className='w-full border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
              {salesPersonName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-500'>
              Data tidak tersedia untuk {salesPersonName}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPositiveGrowth = (data.growthPercentage ?? 0) >= 0;

  // Fungsi untuk memformat jumlah tanpa satuan (kecuali untuk metrik utama)
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('id-ID');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className={cn('w-full max-w-sm', isSingle && 'mx-auto')}>
        <Card className='w-full border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center'>
              <BarChart2 className='w-5 h-5 mr-2 text-blue-500' />
              {data.salesPersonName}
            </CardTitle>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Semua jumlah dalam {currency}
            </p>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
              <Calendar className='w-4 h-4 mr-2 text-gray-400' />
              <span>Period: {data.period}</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='flex items-center text-sm font-medium text-gray-800 dark:text-gray-100'>
                    <DollarSign className='w-4 h-4 mr-2 text-green-500' />
                    <span>
                      Total Invoice: {formatCurrency(data.totalInvoice)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total penjualan untuk periode {data.period}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className='flex items-center text-sm'>
              {isPositiveGrowth ? (
                <TrendingUp className='w-4 h-4 mr-2 text-green-500' />
              ) : (
                <TrendingDown className='w-4 h-4 mr-2 text-red-500' />
              )}
              <span
                className={cn(
                  'font-medium',
                  isPositiveGrowth
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                Growth: {data.growthPercentage ?? 'N/A'}%
              </span>
            </div>
            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
              <BarChart2 className='w-4 h-4 mr-2 text-blue-400' />
              <span>
                Highest Month: {data.highestMonth?.month ?? 'N/A'} (
                {formatAmount(data.highestMonth?.amount ?? 0)})
              </span>
            </div>
            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
              <DollarSign className='w-4 h-4 mr-2 text-gray-400' />
              <span>
                Average Monthly: {formatAmount(data.averageMonthlySales ?? 0)}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <DialogTrigger asChild>
              <Button
                variant='outline'
                className='w-full rounded-lg border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300 transition-colors duration-200'
                onClick={() => setIsOpen(true)}
              >
                View Details
              </Button>
            </DialogTrigger>
          </CardFooter>
        </Card>
      </div>
      <DialogContent className='max-w-lg bg-white dark:bg-gray-800 rounded-xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-800 dark:text-gray-100'>
            {data.salesPersonName} Summary - {data.period}
          </DialogTitle>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            Semua jumlah dalam {currency}
          </p>
        </DialogHeader>
        <div className='space-y-4 text-gray-700 dark:text-gray-200'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-semibold'>Total Invoice</p>
              <p className='text-lg font-medium text-green-600 dark:text-green-400'>
                {formatCurrency(data.totalInvoice)}
              </p>
            </div>
            <div>
              <p className='text-sm font-semibold'>Previous Year</p>
              <p className='text-lg font-medium'>
                {formatAmount(data.previousYearInvoice ?? 0)}
              </p>
            </div>
            <div>
              <p className='text-sm font-semibold'>Growth Percentage</p>
              <p
                className={cn(
                  'text-lg font-medium',
                  isPositiveGrowth
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {data.growthPercentage ?? 'N/A'}%
              </p>
            </div>
            <div>
              <p className='text-sm font-semibold'>Average Monthly</p>
              <p className='text-lg font-medium'>
                {formatAmount(data.averageMonthlySales ?? 0)}
              </p>
            </div>
            <div>
              <p className='text-sm font-semibold'>Highest Month</p>
              <p className='text-lg font-medium text-blue-600 dark:text-blue-400'>
                {data.highestMonth?.month ?? 'N/A'} (
                {formatAmount(data.highestMonth?.amount ?? 0)})
              </p>
            </div>
            <div>
              <p className='text-sm font-semibold'>Lowest Month</p>
              <p className='text-lg font-medium text-blue-600 dark:text-blue-400'>
                {data.lowestMonth?.month ?? 'N/A'} (
                {formatAmount(data.lowestMonth?.amount ?? 0)})
              </p>
            </div>
            <div className='col-span-2'>
              <p className='text-sm font-semibold'>Target Suggestion</p>
              <p className='text-lg font-medium text-orange-600 dark:text-orange-400'>
                {formatAmount(data.targetSalesSuggestion ?? 0)}
              </p>
            </div>
          </div>
          <div>
            <h4 className='font-semibold text-gray-800 dark:text-gray-100 mt-4'>
              Monthly Breakdown
            </h4>
            <div className='mt-2 max-h-64 overflow-y-auto pr-2'>
              <ul className='space-y-2'>
                {(data.months ?? []).map((monthData) => (
                  <li
                    key={monthData.month}
                    className='flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded-md'
                  >
                    <span>{monthData.month}</span>
                    <span className='font-medium'>
                      {formatAmount(monthData.amount ?? 0)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          className='mt-4 w-full bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors duration-200'
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SalespersonSummaryCard;

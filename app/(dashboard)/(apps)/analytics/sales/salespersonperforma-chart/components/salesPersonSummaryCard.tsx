'use client';
import React, { useEffect } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency, CURRENCY } from '@/lib/utils';

interface SalespersonSummaryCardProps {
  salesPersonName: string;
  year?: string;
  currency?: string;
  isDialogOpen: boolean;
  onOpenDialog: () => void;
  onCloseDialog: () => void;
  className?: string; // Tambah prop className
}

const SalespersonSummaryCard: React.FC<SalespersonSummaryCardProps> = ({
  salesPersonName,
  year,
  currency = CURRENCY,
  isDialogOpen,
  onOpenDialog,
  onCloseDialog,
  className,
}) => {
  const { toast } = useToast();

  const startPeriod = `Jan${year}`;
  const endPeriod = `Dec${year}`;

  console.log('SalespersonSummaryCard:', {
    salesPersonName,
    year,
    startPeriod,
    endPeriod,
  });

  const { data, isLoading, error } = useSalespersonFilteredSummary({
    salesPersonName,
    startPeriod,
    endPeriod,
  });

  const handleViewDetailsClick = () => {
    if (!data || !data.totalInvoice) {
      console.log('Data tidak lengkap:', { salesPersonName, data });
      toast({
        description: `Data not available for ${salesPersonName} in ${year}.`,
        variant: 'destructive',
      });
    }
    onOpenDialog();
  };

  if (isLoading) {
    return (
      <div className='relative w-full h-64 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700'>
        <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-red-500 bg-red-50 p-4 rounded-xl w-full'>
        Error: {error.message}
      </div>
    );
  }

  const isPositiveGrowth = (data?.growthPercentage ?? 0) >= 0;
  const growthLabel = isPositiveGrowth ? 'Growth' : 'Decline';

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('id-ID');
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onCloseDialog}>
      <Card
        className={cn(
          'w-full min-h-64 h-full border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800',
          className
        )}
      >
        <CardHeader className='pb-2'>
          <CardTitle className='text-md font-semibold text-gray-800 dark:text-gray-100 flex items-center'>
            <BarChart2 className='w-5 h-5 mr-2 text-blue-500' />
            {salesPersonName}
          </CardTitle>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            All amounts in {currency}
          </p>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
            <Calendar className='w-4 h-4 mr-2 text-gray-400' />
            <span>Period: {data?.period ?? `Jan ${year} - Dec ${year}`}</span>
          </div>
          <div className='flex items-center text-sm'>
            {data && data.growthPercentage !== null && isPositiveGrowth ? (
              <TrendingUp className='w-4 h-4 mr-2 text-green-500' />
            ) : (
              <TrendingDown className='w-4 h-4 mr-2 text-red-500' />
            )}
            <span
              className={cn(
                'font-medium',
                data && data.growthPercentage !== null && isPositiveGrowth
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {data && data.growthPercentage !== null
                ? isPositiveGrowth
                  ? 'Growth'
                  : 'Decline'
                : 'N/A'}
              : {data?.growthPercentage ?? 'N/A'}%
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant='outline'
            className='w-full rounded-lg border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300 transition-colors duration-200'
            onClick={handleViewDetailsClick}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
      <DialogContent className='max-w-xl bg-white dark:bg-gray-800 rounded-xl'>
        <DialogHeader className='flex justify-between items-start'>
          <div>
            <DialogTitle className='text-md font-bold text-gray-800 dark:text-gray-100'>
              {salesPersonName} Summary -{' '}
              {data?.period ?? `Jan ${year} - Dec ${year}`}
            </DialogTitle>
          </div>
          <div className='flex items-center'>
            {data?.growthPercentage !== null && (
              <span
                className={cn(
                  'text-sm',
                  isPositiveGrowth
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {growthLabel} {data?.growthPercentage}%
              </span>
            )}
            {data?.growthPercentage !== null && isPositiveGrowth ? (
              <TrendingUp className='w-4 h-4 ml-1 text-green-500' />
            ) : (
              <TrendingDown className='w-4 h-4 ml-1 text-red-500' />
            )}
          </div>
        </DialogHeader>
        <div className='space-y-4 text-gray-700 dark:text-gray-200'>
          {data && data.totalInvoice ? (
            <>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-semibold'>Total Invoice</p>
                  <p className='text-md font-medium text-green-600 dark:text-green-400'>
                    {formatAmount(data.totalInvoice)}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-semibold'>Previous Year</p>
                  <p className='text-md font-medium'>
                    {formatAmount(data.previousYearInvoice ?? 0)}
                  </p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-semibold'>Highest Month</p>
                  <p className='text-md font-medium text-blue-600 dark:text-blue-400'>
                    {data.highestMonth?.month ?? 'N/A'}:{' '}
                    {formatAmount(data.highestMonth?.amount ?? 0)}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-semibold'>Lowest Month</p>
                  <p className='text-md font-medium text-blue-600 dark:text-blue-400'>
                    {data.lowestMonth?.month ?? 'N/A'}:{' '}
                    {formatAmount(data.lowestMonth?.amount ?? 0)}
                  </p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-semibold'>Average Monthly</p>
                  <p className='text-md font-medium'>
                    {formatAmount(data.averageMonthlySales ?? 0)}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-semibold'>Target Suggestion</p>
                  <p className='text-md font-medium text-orange-600 dark:text-orange-400'>
                    {formatAmount(data.targetSalesSuggestion ?? 0)}
                  </p>
                </div>
              </div>
              <div>
                <h4 className='font-semibold text-gray-800 dark:text-gray-100 mt-4'>
                  Monthly Breakdown
                </h4>
                <div className='mt-2 max-h-64 overflow-y-auto pr-2'>
                  <ul className='space-y-0.5'>
                    {(data.months ?? []).map((monthData) => (
                      <li
                        key={monthData.month}
                        className='flex justify-between items-center text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded-md'
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
            </>
          ) : (
            <div className='text-center text-gray-500 dark:text-gray-400'>
              <p className='text-sm'>
                Data not available for {salesPersonName} in {year}.
              </p>
            </div>
          )}
        </div>
        <Button
          onClick={onCloseDialog}
          className='mt-4 w-full bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors duration-200'
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SalespersonSummaryCard;

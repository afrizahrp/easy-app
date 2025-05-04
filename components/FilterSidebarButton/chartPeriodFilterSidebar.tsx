'use client';
import { useMonthYearPeriodStore } from '@/store';
import { PeriodFilter } from '@/components/period-filter';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';

export function ChartPeriodFilterSidebar() {
  const {
    salesInvoicePeriod,
    setSalesInvoicePeriod,
    setSalesPersonInvoicePeriod,
    resetSalesInvoicePeriod,
    resetSalesPersonInvoicePeriod,
  } = useMonthYearPeriodStore();
  const { toast } = useToast();

  // Handler untuk mengatur semua periode sekaligus
  const handlePeriodChange = (
    period: Partial<{ startPeriod: Date | null; endPeriod: Date | null }>
  ) => {
    setSalesInvoicePeriod(period);
    setSalesPersonInvoicePeriod(period);
  };

  const handleReset = () => {
    try {
      resetSalesInvoicePeriod();
      resetSalesPersonInvoicePeriod();
      toast({
        description: 'Chart period has been reset.',
        color: 'default',
      });
    } catch (error) {
      toast({
        description: `Reset failed: ${error instanceof Error ? error.message : String(error)}`,
        color: 'destructive',
      });
    }
  };

  return (
    <div className='flex flex-col space-y-4 w-full py-2'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>Chart Period</h3>
        <PeriodFilter
          context='salesInvoice'
          onChange={handlePeriodChange}
          value={salesInvoicePeriod}
        />
      </div>

      <Button
        variant='outline'
        onClick={handleReset}
        className='h-10 px-2 w-full mb-5 bg-secondary text-slate hover:bg-secondary-dark dark:bg-secondary dark:text-slate-400 dark:hover:bg-secondary dark:hover:text-slate-400'
      >
        <Cross2Icon className='ml-2 h-4 w-4' />
        Reset Period
      </Button>
    </div>
  );
}

'use client';
import { useMonthYearPeriodStore } from '@/store';
import { SearchContext } from '@/constants/searchContexts';
import { PeriodFilter } from '@/components/period-filter';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';

// Definisikan tipe untuk periode
interface Period {
  startPeriod: Date | null;
  endPeriod: Date | null;
}

// Definisikan interface untuk props
interface ChartPeriodFilterProps {
  title?: string; // Judul filter (opsional)
  filterContext?: SearchContext; // Konteks untuk PeriodFilter (opsional, gunakan SearchContext)
  onPeriodChange?: (period: Partial<Period>) => void; // Handler kustom untuk perubahan periode (opsional)
  onReset?: () => void; // Handler kustom untuk reset (opsional)
  className?: string; // Kelas CSS tambahan (opsional)
}

// Definisikan tipe untuk store
interface MonthYearPeriodStore {
  salesInvoicePeriod: Partial<Period>;
  setSalesInvoicePeriod: (period: Partial<Period>) => void;
  setSalesPersonInvoicePeriod: (period: Partial<Period>) => void;
  resetSalesInvoicePeriod: () => void;
  resetSalesPersonInvoicePeriod: () => void;
}

export function ChartPeriodFilter({
  title = 'Filter Chart by Period',
  filterContext = 'salesInvoice',
  onPeriodChange,
  onReset,
  className,
}: ChartPeriodFilterProps) {
  const {
    salesInvoicePeriod,
    setSalesInvoicePeriod,
    setSalesPersonInvoicePeriod,
    resetSalesInvoicePeriod,
    resetSalesPersonInvoicePeriod,
  } = useMonthYearPeriodStore() as MonthYearPeriodStore;

  const { toast } = useToast();

  // Normalisasi salesInvoicePeriod untuk memastikan undefined menjadi null
  const normalizedPeriod: Partial<Period> = {
    startPeriod: salesInvoicePeriod.startPeriod ?? null,
    endPeriod: salesInvoicePeriod.endPeriod ?? null,
  };

  // Handler untuk mengatur semua periode
  const handlePeriodChange = (period: Partial<Period>) => {
    if (onPeriodChange) {
      onPeriodChange(period);
    } else {
      setSalesInvoicePeriod(period);
      setSalesPersonInvoicePeriod(period);
    }
  };

  // Handler untuk reset periode
  const handleReset = () => {
    try {
      if (onReset) {
        onReset();
      } else {
        resetSalesInvoicePeriod();
        resetSalesPersonInvoicePeriod();
        toast({
          description: 'Chart period has been reset.',
          variant: 'default',
        });
      }
    } catch (error) {
      toast({
        description: `Reset failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`flex flex-col space-y-4 w-full py-2 ${className || ''}`}>
      <div>
        <h3 className='text-lg font-semibold mb-2 text-center'>{title}</h3>
        <PeriodFilter
          context={filterContext}
          onChange={handlePeriodChange}
          value={normalizedPeriod}
        />
      </div>

      <Button
        variant='outline'
        onClick={handleReset}
        className='h-10 px-2 w-full mb-5 bg-secondary text-slate hover:bg-secondary-dark dark:bg-secondary dark:text-slate-100 dark:hover:bg-secondary dark:hover:text-slate-400'
      >
        <Cross2Icon className='ml-2 h-4 w-4' />
        Reset Period
      </Button>
    </div>
  );
}

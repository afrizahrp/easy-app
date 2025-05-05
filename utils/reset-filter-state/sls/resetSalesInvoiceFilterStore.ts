// @/utils/reset-filter-state/sls/resetSalesInvoiceFilterStore.ts
import { Table } from '@tanstack/react-table';
import { useSalesInvoiceHdFilterStore, useMonthYearPeriodStore } from '@/store';
import { useToast } from '@/components/ui/use-toast';

interface UseResetSalesInvoiceFilterParams {
  table?: Table<any>;
  context: 'salesInvoice' | 'salesPersonInvoice';
}

export const useResetSalesInvoiceFilter = ({
  table,
  context,
}: UseResetSalesInvoiceFilterParams) => {
  const { toast } = useToast();

  const { resetSalesInvoiceFilters, resetSalesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore();
  const { resetSalesInvoicePeriod, resetSalesPersonInvoicePeriod } =
    useMonthYearPeriodStore();

  const reset = () => {
    try {
      if (!table) {
        throw new Error('Table instance is undefined');
      }

      table.resetColumnFilters();
      if (context === 'salesInvoice') {
        resetSalesInvoiceFilters();
        resetSalesInvoicePeriod();
      } else if (context === 'salesPersonInvoice') {
        resetSalesPersonInvoiceFilters();
        resetSalesPersonInvoicePeriod();
      }
      toast({
        description: 'All filters and period have been reset.',
        variant: 'success',
      });

      return {
        success: true,
        message: 'All filters and period have been reset.',
      };
    } catch (error) {
      toast({
        description: `Filter reset failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
        variant: 'destructive',
      });
    }
  };

  return { reset };
};

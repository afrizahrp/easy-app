// @/utils/reset-filter-state/sls/resetSalesInvoiceFilterStore.ts
import { Table } from '@tanstack/react-table';
import { useSalesInvoiceHdFilterStore, useMonthYearPeriodStore } from '@/store';

interface UseResetSalesInvoiceFilterParams {
  table?: Table<any>;
  context: 'salesInvoice' | 'salesPersonInvoice';
}

export const useResetSalesInvoiceFilter = ({
  table,
  context,
}: UseResetSalesInvoiceFilterParams) => {
  const { resetSalesInvoiceFilters, resetSalesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore();
  const { resetSalesInvoicePeriod, resetSalesPersonInvoicePeriod } =
    useMonthYearPeriodStore();

  const reset = () => {
    try {
      if (!table) {
        throw new Error('Table instance is undefined');
      }
      console.log(
        `[useResetSalesInvoiceFilter:${context}] Resetting column filters`
      );
      table.resetColumnFilters();
      if (context === 'salesInvoice') {
        console.log(
          `[useResetSalesInvoiceFilter:${context}] Resetting salesInvoice filters and period`
        );
        resetSalesInvoiceFilters();
        resetSalesInvoicePeriod();
      } else if (context === 'salesPersonInvoice') {
        console.log(
          `[useResetSalesInvoiceFilter:${context}] Resetting salesPersonInvoice filters and period`
        );
        resetSalesPersonInvoiceFilters();
        resetSalesPersonInvoicePeriod();
      }
      console.log(`[useResetSalesInvoiceFilter:${context}] Reset successful`);
      return {
        success: true,
        message: 'All filters and period have been reset.',
      };
    } catch (error) {
      console.error(
        `[useResetSalesInvoiceFilter:${context}] Filter and period reset failed:`,
        error
      );
      return {
        success: false,
        message: `Reset failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  };

  return { reset };
};

import { Table } from '@tanstack/react-table';
import { useSalesInvoiceHdFilterStore, useMonthYearPeriodStore } from '@/store';
import { useToast } from '@/components/ui/use-toast';

type SalesInvoiceHdState = ReturnType<
  typeof useSalesInvoiceHdFilterStore.getState
>;
type MonthYearPeriodState = ReturnType<typeof useMonthYearPeriodStore.getState>;
type ToastFunction = ReturnType<typeof useToast>['toast'];

interface ResetFilterParams {
  table?: Table<any>;
  setPaidStatus: SalesInvoiceHdState['setPaidStatus'];
  setSalesPersonName: SalesInvoiceHdState['setSalesPersonName'];
  setPoType: SalesInvoiceHdState['setPoType'];
  resetPeriod: MonthYearPeriodState['reset'];
  toast: ToastFunction;
}

export const ResetSalesInvoiceFilterStore = ({
  table,
  setPaidStatus,
  setSalesPersonName,
  setPoType,
  resetPeriod,
  toast,
}: ResetFilterParams) => {
  table?.resetColumnFilters();
  setPaidStatus([]);
  setSalesPersonName([]);
  setPoType([]);
  resetPeriod();
  toast({
    description: 'All filters have been cleared.',
    color: 'success',
  });
};

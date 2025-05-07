'use client';
import { useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { startOfMonth, endOfMonth } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { SearchContext } from '@/constants/searchContexts';
import useSalesInvoiceHdPaidStatusOptions from '@/queryHooks/sales/useSalesInvoiceHdPaidStatusOptions';
import useSalesInvoiceHdSalesPersonOptions from '@/queryHooks/sales/useSalesInvoiceHdSalesPersonOptions';
import { PeriodFilter } from '@/components/period-filter';
import { useResetSalesInvoiceFilter } from '@/utils/reset-filter-state/sls/resetSalesInvoiceFilterStore';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { useMonthYearPeriodStore, useSalesInvoiceHdFilterStore } from '@/store';
import { useToast } from '@/components/ui/use-toast';

interface SalesPersonInvoiceFilterSidebarProps<TData> {
  table: Table<TData>;
  context?: SearchContext;
}

export function SalesPersonInvoiceFilterSidebar<TData>({
  table,
  context,
}: SalesPersonInvoiceFilterSidebarProps<TData>) {
  const { salesPersonInvoicePeriod, setSalesPersonInvoicePeriod } =
    useMonthYearPeriodStore();
  const { salesPersonInvoiceFilters, setSalesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore();
  const { toast } = useToast();
  const [showAlert, setShowAlert] = useState(false);

  const { reset } = useResetSalesInvoiceFilter({
    table,
    context: 'salesPersonInvoice',
  });

  const { paidStatus, salesPersonName } = salesPersonInvoiceFilters;

  useEffect(() => {
    let isResetting = false;

    const normalizedStart = salesPersonInvoicePeriod.startPeriod
      ? zonedTimeToUtc(
          startOfMonth(salesPersonInvoicePeriod.startPeriod),
          'UTC'
        )
      : null;
    let normalizedEnd = salesPersonInvoicePeriod.endPeriod
      ? zonedTimeToUtc(endOfMonth(salesPersonInvoicePeriod.endPeriod), 'UTC')
      : null;

    if (
      normalizedStart &&
      !normalizedEnd &&
      salesPersonInvoicePeriod.startPeriod
    ) {
      normalizedEnd = zonedTimeToUtc(
        endOfMonth(salesPersonInvoicePeriod.startPeriod),
        'UTC'
      );
    }

    if (normalizedStart && normalizedEnd && normalizedEnd < normalizedStart) {
      console.warn(
        '[SalesPersonInvoiceFilterSidebar] Invalid date range: endPeriod is before startPeriod. Resetting endPeriod.',
        {
          startPeriod: normalizedStart.toISOString(),
          endPeriod: normalizedEnd.toISOString(),
        }
      );
      setSalesPersonInvoicePeriod({ endPeriod: null });
      normalizedEnd = null;
      toast({
        description:
          'End Period cannot be earlier than Start Period. End Period has been reset.',
        variant: 'destructive',
      });
    }

    if (table && !isResetting) {
      table
        .getColumn('paidStatus')
        ?.setFilterValue(paidStatus.length ? paidStatus : undefined);
      table
        .getColumn('salesPersonName')
        ?.setFilterValue(salesPersonName.length ? salesPersonName : undefined);

      let filterValue: { start: Date; end: Date } | undefined;
      if (normalizedStart && salesPersonInvoicePeriod.startPeriod) {
        filterValue = {
          start: normalizedStart,
          end:
            normalizedEnd ??
            zonedTimeToUtc(
              endOfMonth(salesPersonInvoicePeriod.startPeriod),
              'UTC'
            ),
        };
      }
      table.getColumn('invoiceDate')?.setFilterValue(filterValue);
    }

    return () => {
      isResetting = true;
    };
  }, [
    salesPersonInvoicePeriod,
    paidStatus,
    salesPersonName,
    table,
    setSalesPersonInvoicePeriod,
    toast,
  ]);

  useEffect(() => {
    if (salesPersonName.length > 1) {
      setSalesPersonInvoiceFilters({ paidStatus: [] });
    }
  }, [salesPersonName, setSalesPersonInvoiceFilters]);

  useEffect(() => {
    if (salesPersonName.length > 1) {
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowAlert(false);
    }
  }, [salesPersonName]);

  useEffect(() => {
    if (salesPersonName.length > 1) {
      setShowAlert(true);
      toast({
        description:
          'The Paid Status filter only works when one Sales Person is selected.',
        variant: 'destructive',
      });
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowAlert(false);
    }
  }, [salesPersonName, toast]);

  const {
    options: statusOptionList,
    isLoading: isStatusLoading,
    error: statusError,
  } = useSalesInvoiceHdPaidStatusOptions({ context: 'salesPersonInvoice' });
  const {
    options: salesPersonOptionList,
    isLoading: isSalesPersonLoading,
    error: salesPersonError,
  } = useSalesInvoiceHdSalesPersonOptions({ context: 'salesPersonInvoice' });

  const handleReset = () => {
    try {
      console.log('[SalesPersonInvoiceFilterSidebar] Initiating reset');
      const result = reset();
      toast({
        description: result?.message ?? 'Reset successful.',
        variant: 'success',
      });
      console.log('[SalesInvoiceFilterSidebar] Reset result:', result);
    } catch (error) {
      console.error('[SalesInvoiceFilterSidebar] Reset error:', error);
      toast({
        description: `Reset failed: ${error instanceof Error ? error.message : String(error)}`,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (salesPersonName.length > 1) {
      setShowAlert(true);
      toast({
        description:
          'The Paid Status filter only works when one Sales Person is selected.',
      });
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowAlert(false);
    }
  }, [salesPersonName, toast]);

  useEffect(() => {
    if (statusError || salesPersonError) {
      toast({
        description:
          'Error loading filter options: ' +
          (statusError?.message ||
            salesPersonError?.message ||
            'Unknown error'),
      });
    }
  }, [statusError, salesPersonError, toast]);

  const hasActiveFilters =
    (table?.getState?.().columnFilters?.length ?? 0) > 0 ||
    salesPersonName.length > 0 ||
    paidStatus.length > 0;

  return (
    <div className='flex flex-col space-y-4 w-full py-2'>
      <PeriodFilter context='salesPersonInvoice' />

      <div className='w-full py-3 dark:text-slate-400'>
        <DataTableFacetedFilter
          column={table?.getColumn('salesPersonName')}
          title='Sales Person'
          options={salesPersonOptionList}
          isLoading={isSalesPersonLoading}
          selectedValues={new Set(salesPersonName)}
          onSelect={(value) => {
            const updatedValues = new Set(salesPersonName);
            if (value) {
              updatedValues.has(value)
                ? updatedValues.delete(value)
                : updatedValues.add(value);
            } else {
              updatedValues.clear();
            }
            setSalesPersonInvoiceFilters({
              salesPersonName: Array.from(updatedValues),
            });
          }}
        />
      </div>

      <div className='w-full py-3'>
        {/* {table?.getColumn('paidStatus') && ( */}
        <DataTableFacetedFilter
          column={table.getColumn('paidStatus')}
          title='Paid Status'
          options={statusOptionList}
          isLoading={isStatusLoading}
          disabled={salesPersonName.length > 1}
          selectedValues={new Set(paidStatus)}
          onSelect={(value) => {
            const updatedValues = new Set(paidStatus);
            if (value) {
              updatedValues.has(value)
                ? updatedValues.delete(value)
                : updatedValues.add(value);
            } else {
              updatedValues.clear();
            }
            setSalesPersonInvoiceFilters({
              paidStatus: Array.from(updatedValues),
            });
          }}
          aria-label='paidStatus sales person invoice filter'
        />
        {/* )} */}
      </div>

      {hasActiveFilters && (
        <Button
          variant='outline'
          onClick={handleReset}
          className='h-10 px-2 w-full mb-5 bg-secondary text-slate hover:bg-secondary-dark dark:bg-secondary dark:text-slate-400 dark:hover:bg-secondary dark:hover:text-slate-400'
        >
          <Cross2Icon className='ml-2 h-4 w-4' />
          Reset Filter
        </Button>
      )}
    </div>
  );
}

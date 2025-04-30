'use client';
import { useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { AlertCircle } from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { zonedTimeToUtc } from 'date-fns-tz';
import useSalesInvoiceHdPaidStatusOptions from '@/queryHooks/sls/useSalesInvoiceHdPaidStatusOptions';
import useSalesInvoiceHdSalesPersonOptions from '@/queryHooks/sls/useSalesInvoiceHdSalesPersonOptions';
import { PeriodFilter } from '@/components/period-filter';
import { ResetSalesInvoiceFilterStore } from '@/utils/reset-filter-state/sls/resetSalesInvoiceFilterStore';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { useMonthYearPeriodStore, useSalesInvoiceHdFilterStore } from '@/store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SalesPersonInvoiceFilterSidebarProps<TData> {
  table?: Table<TData>;
}

export function SalesPersonInvoiceFilterSidebar<TData>({
  table,
}: SalesPersonInvoiceFilterSidebarProps<TData>) {
  const { startPeriod, setStartPeriod, endPeriod, setEndPeriod, reset } =
    useMonthYearPeriodStore();
  const {
    paidStatus,
    setPaidStatus,
    poType,
    setPoType,
    salesPersonName,
    setSalesPersonName,
  } = useSalesInvoiceHdFilterStore();
  const { toast } = useToast();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const normalizedStart = startPeriod
      ? zonedTimeToUtc(startOfMonth(startPeriod), 'UTC')
      : null;
    let normalizedEnd = endPeriod
      ? zonedTimeToUtc(endOfMonth(endPeriod), 'UTC')
      : null;

    if (normalizedStart && !normalizedEnd && startPeriod) {
      normalizedEnd = zonedTimeToUtc(endOfMonth(startPeriod), 'UTC');
    }

    if (normalizedStart && normalizedEnd && normalizedEnd < normalizedStart) {
      console.warn(
        'Invalid date range: endPeriod is before startPeriod. Resetting endPeriod.',
        {
          startPeriod: normalizedStart.toISOString(),
          endPeriod: normalizedEnd.toISOString(),
        }
      );
      setEndPeriod(null);
      normalizedEnd = null;
      toast({
        description:
          'End Period cannot be earlier than Start Period. End Period has been reset.',
        color: 'destructive',
      });
    }

    if (table) {
      table
        .getColumn('paidStatus')
        ?.setFilterValue(paidStatus.length ? paidStatus : undefined);
      table
        .getColumn('salesPersonName')
        ?.setFilterValue(salesPersonName.length ? salesPersonName : undefined);

      let filterValue: { start: Date; end: Date } | undefined;
      if (normalizedStart && startPeriod) {
        filterValue = {
          start: normalizedStart,
          end: normalizedEnd ?? zonedTimeToUtc(endOfMonth(startPeriod), 'UTC'),
        };
      }
      table.getColumn('invoiceDate')?.setFilterValue(filterValue);
    }

    const filteredRows = table ? table.getFilteredRowModel().rows : [];
    console.log('Filtered rows count:', filteredRows.length);
  }, [
    startPeriod,
    endPeriod,
    paidStatus,
    poType,
    salesPersonName,
    table,
    setEndPeriod,
    toast,
  ]);

  useEffect(() => {
    if (salesPersonName.length > 1) {
      setPaidStatus([]);
    }
  }, [salesPersonName, setPaidStatus]);

  useEffect(() => {
    if (salesPersonName.length > 1) {
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowAlert(false);
    }
  }, [salesPersonName]);

  const { options: statusOptionList, isLoading: isStatusLoading } =
    useSalesInvoiceHdPaidStatusOptions();
  const { options: salesPersonOptionList, isLoading: isSalesPersonLoading } =
    useSalesInvoiceHdSalesPersonOptions();

  const handleReset = () => {
    ResetSalesInvoiceFilterStore({
      table,
      setPaidStatus,
      setSalesPersonName,
      setPoType,
      resetPeriod: reset,
      toast,
    });
  };

  // Cek apakah ada filter aktif dengan optional chaining
  const hasActiveFilters =
    (table?.getState?.().columnFilters?.length ?? 0) > 0 ||
    salesPersonName.length > 0;

  return (
    <div className='flex flex-col space-y-4 w-full py-2'>
      {showAlert && (
        <Alert variant='destructiveDark' className='w-full'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            The Status filter is disabled when multiple Sales Persons are
            selected.
          </AlertDescription>
        </Alert>
      )}
      <PeriodFilter />

      <div className='w-full py-3 dark:text-slate-400'>
        <DataTableFacetedFilter
          column={table?.getColumn('salesPersonName')}
          title='Sales Person'
          options={salesPersonOptionList}
          isLoading={isSalesPersonLoading}
          selectedValues={new Set(salesPersonName)}
          onSelect={(value) => {
            const updatedValues = new Set(salesPersonName);
            value
              ? updatedValues.has(value)
                ? updatedValues.delete(value)
                : updatedValues.add(value)
              : updatedValues.clear();
            setSalesPersonName(Array.from(updatedValues));
          }}
        />
      </div>

      <div className='w-full py-3'>
        {/* {table?.getColumn('paidStatus') && ( */}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex items-center gap-2'>
                <span>Paid Status</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Applies to invoice list only</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DataTableFacetedFilter
          column={table?.getColumn('paidStatus')}
          title='Paid Status'
          options={statusOptionList}
          isLoading={isStatusLoading}
          disabled={salesPersonName.length > 1}
          selectedValues={new Set(paidStatus)}
          onSelect={(value) => {
            const updatedValues = new Set(paidStatus);
            value
              ? updatedValues.has(value)
                ? updatedValues.delete(value)
                : updatedValues.add(value)
              : updatedValues.clear();
            setPaidStatus(Array.from(updatedValues));
          }}
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

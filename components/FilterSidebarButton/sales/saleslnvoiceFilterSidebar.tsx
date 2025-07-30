'use client';
import { useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { startOfMonth, endOfMonth } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import useSalesInvoiceHdPaidStatusOptions from '@/queryHooks/sales/useSalesInvoiceHdPaidStatusOptions';
import useSalesInvoiceHdSalesPersonOptions from '@/queryHooks/sales/useSalesInvoiceHdSalesPersonOptions';
import useSalesInvoiceHdPoTypeOptions from '@/queryHooks/sales/useSalesInvoiceHdPoTypeOptions';
import { PeriodFilter } from '@/components/period-filter';
import { useResetSalesInvoiceFilter } from '@/utils/reset-filter-state/sls/resetSalesInvoiceFilterStore';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import CompanyFacetedFilter from '@/components/ui/companyFacetedFilter';

import { useMonthYearPeriodStore, useSalesInvoiceHdFilterStore } from '@/store';
import { SearchContext } from '@/constants/searchContexts';
import { useToast } from '@/components/ui/use-toast';

interface SalesInvoiceFilterSidebarProps<TData> {
  table: Table<TData>;
  context?: SearchContext;
}

export function SalesInvoiceFilterSidebar<TData>({
  table,
  context,
}: SalesInvoiceFilterSidebarProps<TData>) {
  const { salesInvoicePeriod, setSalesInvoicePeriod } =
    useMonthYearPeriodStore();
  const { salesInvoiceFilters, setSalesInvoiceFilters } =
    useSalesInvoiceHdFilterStore();
  const { toast } = useToast();
  const [showAlert, setShowAlert] = useState(false);

  const { reset } = useResetSalesInvoiceFilter({
    table,
    context: 'salesInvoice',
  });

  const { paidStatus, salesPersonName, poType } = salesInvoiceFilters;

  useEffect(() => {
    let isResetting = false;

    const normalizedStart = salesInvoicePeriod.startPeriod
      ? zonedTimeToUtc(startOfMonth(salesInvoicePeriod.startPeriod), 'UTC')
      : null;
    let normalizedEnd = salesInvoicePeriod.endPeriod
      ? zonedTimeToUtc(endOfMonth(salesInvoicePeriod.endPeriod), 'UTC')
      : null;

    if (normalizedStart && !normalizedEnd && salesInvoicePeriod.startPeriod) {
      normalizedEnd = zonedTimeToUtc(
        endOfMonth(salesInvoicePeriod.startPeriod),
        'UTC'
      );
    }

    if (normalizedStart && normalizedEnd && normalizedEnd < normalizedStart) {
      console.warn(
        '[SalesInvoiceFilterSidebar] Invalid date range: endPeriod is before startPeriod. Resetting endPeriod.',
        {
          startPeriod: normalizedStart.toISOString(),
          endPeriod: normalizedEnd.toISOString(),
        }
      );
      setSalesInvoicePeriod({ endPeriod: null });
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
      table
        .getColumn('poType')
        ?.setFilterValue(poType.length ? poType : undefined);

      let filterValue: { start: Date; end: Date } | undefined;
      if (normalizedStart && salesInvoicePeriod.startPeriod) {
        filterValue = {
          start: normalizedStart,
          end:
            normalizedEnd ??
            zonedTimeToUtc(endOfMonth(salesInvoicePeriod.startPeriod), 'UTC'),
        };
      }
      table.getColumn('invoiceDate')?.setFilterValue(filterValue);
    }

    return () => {
      isResetting = true;
    };
  }, [
    salesInvoicePeriod,
    paidStatus,
    salesPersonName,
    poType,
    table,
    setSalesInvoicePeriod,
    toast,
  ]);

  useEffect(() => {
    if (salesPersonName.length > 1) {
      setSalesInvoiceFilters({ paidStatus: [] });
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowAlert(false);
    }
  }, [salesPersonName, setSalesInvoiceFilters]);

  const {
    options: paidStatusOptions,
    isLoading: isPaidStatusLoading,
    error: paidStatusError,
  } = useSalesInvoiceHdPaidStatusOptions({ context: 'salesInvoice' });

  const {
    options: poTypeOptionList,
    isLoading: isPoTypeLoading,
    error: poTypeError,
  } = useSalesInvoiceHdPoTypeOptions({ context: 'salesInvoice' });

  const {
    options: salesPersonOptionList,
    isLoading: isSalesPersonLoading,
    error: salesPersonError,
  } = useSalesInvoiceHdSalesPersonOptions({ context: 'salesInvoice' });

  const handleReset = () => {
    try {
      console.log('[SalesInvoiceFilterSidebar] Initiating reset');
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

  const hasActiveFilters =
    (table?.getState?.().columnFilters?.length ?? 0) > 0 ||
    salesPersonName.length > 0 ||
    // paidStatus.length > 0 ||
    poType.length > 0;

  return (
    <div className='flex flex-col space-y-3 w-full py-1'>
      <PeriodFilter context='salesInvoice' />

      <CompanyFacetedFilter />

      <DataTableFacetedFilter
        column={table?.getColumn('paidStatus')}
        title='Paid Status'
        options={paidStatusOptions}
        isLoading={isPaidStatusLoading}
        disabled={salesPersonName.length > 1}
        selectedValues={new Set(paidStatus)}
        onSelect={(value) => {
          const updatedValues = new Set(paidStatus);
          if (value) {
            if (updatedValues.has(value)) {
              updatedValues.delete(value);
            } else {
              updatedValues.add(value);
            }
          } else {
            updatedValues.clear();
          }
          setSalesInvoiceFilters({
            paidStatus: Array.from(updatedValues),
          });
        }}
      />

      <DataTableFacetedFilter
        column={table?.getColumn('poType')}
        title='PO Type'
        options={poTypeOptionList}
        isLoading={isPoTypeLoading}
        disabled={salesPersonName.length > 1}
        selectedValues={new Set(poType)}
        onSelect={(value) => {
          const updatedValues = new Set(poType);
          if (value) {
            if (updatedValues.has(value)) {
              updatedValues.delete(value);
            } else {
              updatedValues.add(value);
            }
          } else {
            updatedValues.clear();
          }
          setSalesInvoiceFilters({
            poType: Array.from(updatedValues),
          });
        }}
      />

      <div className='dark:text-slate-400'>
        <DataTableFacetedFilter
          column={table?.getColumn('salesPersonName')}
          title='Sales Person'
          options={salesPersonOptionList}
          isLoading={isSalesPersonLoading}
          selectedValues={new Set(salesPersonName)}
          onSelect={(value) => {
            const updatedValues = new Set(salesPersonName);
            if (value) {
              if (updatedValues.has(value)) {
                updatedValues.delete(value);
              } else {
                updatedValues.add(value);
              }
            } else {
              updatedValues.clear();
            }
            setSalesInvoiceFilters({
              salesPersonName: Array.from(updatedValues),
            });
          }}
        />
      </div>

      {hasActiveFilters && (
        <Button
          variant='outline'
          onClick={handleReset}
          className='h-9 px-2 w-full bg-secondary text-slate hover:bg-secondary-dark dark:bg-secondary dark:text-slate-400 dark:hover:bg-secondary dark:hover:text-slate-400'
        >
          <Cross2Icon className='mr-2 h-4 w-4' />
          Reset Filter
        </Button>
      )}
    </div>
  );
}

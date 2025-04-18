'use client';
import { useEffect } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import useSalesInvoiceHdPaidStatusOptions from '@/queryHooks/useSalesInvoiceHdPaidStatusOptions';
import useSalesInvoiceHdSalesPersonOptions from '@/queryHooks/useSalesInvoiceHdSalesPersonOptions';

import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { useSalesInvoiceHdFilterStore } from '@/store';

interface SalesInvoiceFilterSidebarProps<TData> {
  table: Table<TData>;
}

export function SalesInvoiceFilterSidebar<TData>({
  table,
}: SalesInvoiceFilterSidebarProps<TData>) {
  const { status, setStatus, salesPersonName, setSalesPersonName } =
    useSalesInvoiceHdFilterStore();

  useEffect(() => {
    console.log('SalesInvoiceFilterSidebar: Current status:', status);
    console.log(
      'SalesInvoiceFilterSidebar: Current salesPersonName:',
      salesPersonName
    );

    table
      .getColumn('paidStatus')
      ?.setFilterValue(status.length ? status : undefined);
    table
      .getColumn('salesPersonName')
      ?.setFilterValue(salesPersonName.length ? salesPersonName : undefined);
  }, [status, salesPersonName, table]);

  const { options: statusOptionList, isLoading: isStatusLoading } =
    useSalesInvoiceHdPaidStatusOptions();

  const { options: salesPersonOptionList, isLoading: isSalesPersonLoading } =
    useSalesInvoiceHdSalesPersonOptions();

  return (
    <div className='flex items-center justify-end py-2'>
      <div className='flex flex-col items-center space-y-2 w-full'>
        <div className='w-full py-3'>
          {table.getColumn('paidStatus') && (
            <DataTableFacetedFilter
              column={table.getColumn('paidStatus')}
              title='Status'
              options={statusOptionList}
              isLoading={isStatusLoading}
              selectedValues={new Set(status)}
              onSelect={(value) => {
                const updatedValues = new Set(status);
                value
                  ? updatedValues.has(value)
                    ? updatedValues.delete(value)
                    : updatedValues.add(value)
                  : updatedValues.clear();
                console.log(
                  'SalesInvoiceFilterSidebar: Setting status:',
                  Array.from(updatedValues)
                );
                setStatus(Array.from(updatedValues));
              }}
            />
          )}
        </div>
        <div className='w-full py-3'>
          {table.getColumn('salesPersonName') && (
            <DataTableFacetedFilter
              column={table.getColumn('salesPersonName')}
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
                console.log(
                  'SalesInvoiceFilterSidebar: Setting salesPersonName:',
                  Array.from(updatedValues)
                );
                setSalesPersonName(Array.from(updatedValues));
              }}
            />
          )}
        </div>
        {table.getState().columnFilters.length > 0 && (
          <Button
            variant='outline'
            onClick={() => {
              table.resetColumnFilters();
              setStatus([]);
              setSalesPersonName([]);
            }}
            className='h-10 px-2 lg:px-3 w-full mb-5'
          >
            <Cross2Icon className='ml-2 h-4 w-4' />
            Reset Filter
          </Button>
        )}
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import useSalesInvoiceHdStatusOptions from '@/queryHooks/useSalesInvoiceHdStatusOptions';
import useSalesInvoiceHdSalesPersonOptions from '@/queryHooks/useSalesInvoiceHdStatusOptions';

import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { useSalesInvoiceHdFilterStore } from '@/store'; // ✅ Gunakan Zustand Store
// import { CustomDatePicker } from '../ui/custom-date-picker';
// import { MonthYearPickerRange } from '@/components/ui/monthYearPickerRange';

interface SalesInvoiceFilterSidebarProps<TData> {
  table: Table<TData>;
}

export function SalesInvoiceFilterSidebar<TData>({
  table,
}: SalesInvoiceFilterSidebarProps<TData>) {
  const { status, setStatus, salesPersonName, setSalesPersonName } =
    useSalesInvoiceHdFilterStore();

  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});

  useEffect(() => {
    table
      .getColumn('invoiceStatus')
      ?.setFilterValue(status.length ? status : undefined);
    table
      .getColumn('salesPersonName')
      ?.setFilterValue(salesPersonName.length ? salesPersonName : undefined);
  }, [status, salesPersonName, table]);

  const { options: statusOptionList, isLoading: isStatusLoading } =
    useSalesInvoiceHdStatusOptions();

  const { options: salesPersonOptionList, isLoading: isSalesPersonLoading } =
    useSalesInvoiceHdSalesPersonOptions();

  // const { typeOptions: typeOptionList, isLoading: isTypeLoading } =
  //   useSalesInvoiceHdTypeOptions();

  return (
    <div className='flex items-center justify-end py-2'>
      <div className='flex flex-col items-center space-y-2 w-full'>
        <div className='w-full py-3'>
          {table.getColumn('invoiceStatus') && (
            <DataTableFacetedFilter
              column={table.getColumn('invoiceStatus')}
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
                setStatus(Array.from(updatedValues));
                table
                  .getColumn('invoiceStatus')
                  ?.setFilterValue(
                    updatedValues.size ? Array.from(updatedValues) : undefined
                  );
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
                setSalesPersonName(Array.from(updatedValues));
                table
                  .getColumn('salesPersonName')
                  ?.setFilterValue(
                    updatedValues.size ? Array.from(updatedValues) : undefined
                  );
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
              // setInvoiceType([]);
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

'use client';
import { useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { AlertCircle } from 'lucide-react';

import useSalesInvoiceHdPaidStatusOptions from '@/queryHooks/useSalesInvoiceHdPaidStatusOptions';
import useSalesInvoiceHdSalesPersonOptions from '@/queryHooks/useSalesInvoiceHdSalesPersonOptions';

import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { MonthYearPicker } from '@/components/ui/monthYearPicker';

interface SalesInvoiceFilterSidebarProps<TData> {
  table: Table<TData>;
}

export function SalesInvoiceFilterSidebar<TData>({
  table,
}: SalesInvoiceFilterSidebarProps<TData>) {
  const { status, setStatus, salesPersonName, setSalesPersonName } =
    useSalesInvoiceHdFilterStore();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    console.log(
      'useEffect triggered, salesPersonName:',
      salesPersonName,
      'status:',
      status
    );
    table
      .getColumn('paidStatus')
      ?.setFilterValue(status.length ? status : undefined);
    table
      .getColumn('salesPersonName')
      ?.setFilterValue(salesPersonName.length ? salesPersonName : undefined);
  }, [status, salesPersonName, table]);

  useEffect(() => {
    if (salesPersonName.length > 1) {
      setStatus([]);
    }
  }, [salesPersonName, setStatus]);

  useEffect(() => {
    if (salesPersonName.length > 1) {
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 5000); // Sembunyikan setelah 5 detik
      return () => clearTimeout(timer);
    } else {
      setShowAlert(false);
    }
  }, [salesPersonName]);

  const { options: statusOptionList, isLoading: isStatusLoading } =
    useSalesInvoiceHdPaidStatusOptions();

  const { options: salesPersonOptionList, isLoading: isSalesPersonLoading } =
    useSalesInvoiceHdSalesPersonOptions();

  return (
    <div className='flex items-center justify-end py-2'>
      <div className='flex flex-col items-center space-y-2 w-full'>
        {showAlert && (
          <Alert variant='destructiveDark' className='w-full'>
            <AlertCircle className='h-4 w-4' />
            {/* <AlertTitle>Paid Status Filter is Disabled</AlertTitle> */}
            <AlertDescription>
              The Status filter is disabled when multiple Sales Persons are
              selected."
            </AlertDescription>
          </Alert>
        )}

        <div className='w-full py-3'>
          {table.getColumn('paidStatus') && (
            <DataTableFacetedFilter
              column={table.getColumn('paidStatus')}
              title='Status'
              options={statusOptionList}
              isLoading={isStatusLoading}
              disabled={salesPersonName.length > 1} // ✅ tambahkan ini
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

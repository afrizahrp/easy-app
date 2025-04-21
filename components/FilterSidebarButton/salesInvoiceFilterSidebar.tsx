'use client';
import { useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { AlertCircle } from 'lucide-react';
import { startOfMonth, endOfMonth, isValid, set } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import useSalesInvoiceHdPaidStatusOptions from '@/queryHooks/useSalesInvoiceHdPaidStatusOptions';
import useSalesInvoiceHdSalesPersonOptions from '@/queryHooks/useSalesInvoiceHdSalesPersonOptions';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SalesInvoiceFilterSidebarProps<TData> {
  table: Table<TData>;
}

export function SalesInvoiceFilterSidebar<TData>({
  table,
}: SalesInvoiceFilterSidebarProps<TData>) {
  const {
    status,
    setStatus,
    salesPersonName,
    setSalesPersonName,
    startPeriod,
    setStartPeriod,
    endPeriod,
    setEndPeriod,
  } = useSalesInvoiceHdFilterStore();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Normalisasi ke UTC
    const normalizedStart = startPeriod
      ? set(startOfMonth(startPeriod), {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        })
      : null;
    const normalizedEnd = endPeriod
      ? set(endOfMonth(endPeriod), {
          hours: 23,
          minutes: 59,
          seconds: 59,
          milliseconds: 999,
        })
      : null;

    // console.log(
    //   'useEffect triggered, salesPersonName:',
    //   salesPersonName,
    //   'status:',
    //   status,
    //   'startPeriod:',
    //   normalizedStart?.toISOString(),
    //   'endPeriod:',
    //   normalizedEnd?.toISOString()
    // );

    table
      .getColumn('paidStatus')
      ?.setFilterValue(status.length ? status : undefined);
    table
      .getColumn('salesPersonName')
      ?.setFilterValue(salesPersonName.length ? salesPersonName : undefined);
    table
      .getColumn('monthYear')
      ?.setFilterValue(
        normalizedStart && normalizedEnd && normalizedEnd >= normalizedStart
          ? { start: normalizedStart, end: normalizedEnd }
          : undefined
      );
  }, [status, salesPersonName, startPeriod, endPeriod, table]);

  useEffect(() => {
    if (salesPersonName.length > 1) {
      setStatus([]);
    }
  }, [salesPersonName, setStatus]);

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

  return (
    <div className='flex items-center justify-end py-2'>
      <div className='flex flex-col items-center space-y-2 w-full'>
        {showAlert && (
          <Alert variant='destructiveDark' className='w-full'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              The Status filter is disabled when multiple Sales Persons are
              selected.
            </AlertDescription>
          </Alert>
        )}

        <div className='w-full flex flex-wrap gap-2 py-3'>
          <div className='min-w-[120px]'>
            <label className='text-sm font-medium mb-1 block'>
              Start Period
            </label>
            <DatePicker
              selected={startPeriod}
              onChange={(date) =>
                setStartPeriod(
                  date
                    ? set(startOfMonth(date), {
                        hours: 0,
                        minutes: 0,
                        seconds: 0,
                        milliseconds: 0,
                      })
                    : null
                )
              }
              showMonthYearPicker
              dateFormat='MMM yyyy'
              placeholderText='Jan 2025'
              className='w-[120px] h-10 px-3 border rounded-md'
              shouldCloseOnSelect={false}
              showYearDropdown
              yearDropdownItemNumber={15}
              scrollableYearDropdown
            />
          </div>
          <div className='min-w-[120px]'>
            <label className='text-sm font-medium mb-1 block'>End Period</label>
            <DatePicker
              selected={endPeriod}
              onChange={(date) =>
                setEndPeriod(
                  date
                    ? set(endOfMonth(date), {
                        hours: 23,
                        minutes: 59,
                        seconds: 59,
                        milliseconds: 999,
                      })
                    : null
                )
              }
              showMonthYearPicker
              dateFormat='MMM yyyy'
              placeholderText='Mar 2025'
              minDate={startPeriod || undefined}
              className='w-[120px] h-10 px-3 border rounded-md'
              shouldCloseOnSelect={false}
              showYearDropdown
              yearDropdownItemNumber={15}
              scrollableYearDropdown
            />
          </div>
        </div>

        <div className='w-full py-3'>
          {table.getColumn('paidStatus') && (
            <DataTableFacetedFilter
              column={table.getColumn('paidStatus')}
              title='Status'
              options={statusOptionList}
              isLoading={isStatusLoading}
              disabled={salesPersonName.length > 1}
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
              setStartPeriod(null);
              setEndPeriod(null);
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

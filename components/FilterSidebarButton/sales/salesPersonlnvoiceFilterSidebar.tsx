'use client';
import { useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { AlertCircle } from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { set as setDate } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { zonedTimeToUtc } from 'date-fns-tz';

import useSalesInvoiceHdPaidStatusOptions from '@/queryHooks/sls/useSalesInvoiceHdPaidStatusOptions';
import useSalesInvoiceHdSalesPersonOptions from '@/queryHooks/sls/useSalesInvoiceHdSalesPersonOptions';
import useSalesInvoiceHdPoTypeOptions from '@/queryHooks/sls/useSalesInvoiceHdPoTypeOptions';
import { PeriodFilter } from '@/components/period-filter';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { useMonthYearPeriodStore, useSalesInvoiceHdFilterStore } from '@/store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

// import DatePicker from 'react-datepicker';

interface SalesPersonInvoiceFilterSidebarProps<TData> {
  table: Table<TData>;
}

export function SalesPersonInvoiceFilterSidebar<TData>({
  table,
}: SalesPersonInvoiceFilterSidebarProps<TData>) {
  const { startPeriod, setStartPeriod, endPeriod, setEndPeriod } =
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
    // Normalisasi ke UTC
    const normalizedStart = startPeriod
      ? zonedTimeToUtc(startOfMonth(startPeriod), 'UTC')
      : null;
    let normalizedEnd = endPeriod
      ? zonedTimeToUtc(endOfMonth(endPeriod), 'UTC')
      : null;

    // Jika endPeriod tidak ada, gunakan akhir bulan dari startPeriod
    if (normalizedStart && !normalizedEnd && startPeriod) {
      normalizedEnd = zonedTimeToUtc(endOfMonth(startPeriod), 'UTC');
    }

    // Validasi: Jika endPeriod lebih awal dari startPeriod, atur ulang endPeriod
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

    table
      .getColumn('paidStatus')
      ?.setFilterValue(paidStatus.length ? paidStatus : undefined);
    table
      .getColumn('salesPersonName')
      ?.setFilterValue(salesPersonName.length ? salesPersonName : undefined);
    table
      .getColumn('poType')
      ?.setFilterValue(poType.length ? poType : undefined);

    // Terapkan filter invoiceDate
    let filterValue: { start: Date; end: Date } | undefined;
    if (normalizedStart && startPeriod) {
      filterValue = {
        start: normalizedStart,
        end: normalizedEnd ?? zonedTimeToUtc(endOfMonth(startPeriod), 'UTC'),
      };
    }

    console.log('Setting invoiceDate filter:', filterValue);

    table.getColumn('invoiceDate')?.setFilterValue(filterValue);

    // Log data yang difilter
    const filteredRows = table.getFilteredRowModel().rows;
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
  const { options: poTypeOptionList, isLoading: isPoTypeLoading } =
    useSalesInvoiceHdPoTypeOptions();

  const handleReset = () => {
    // console.log('Resetting filters...');
    table.resetColumnFilters();
    setPaidStatus([]);
    setSalesPersonName([]);
    setPoType([]);
    // Atur ulang ke nilai default
    setStartPeriod(
      setDate(startOfMonth(new Date(2025, 0, 1)), {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      })
    );
    setEndPeriod(
      setDate(endOfMonth(new Date()), {
        hours: 23,
        minutes: 59,
        seconds: 59,
        milliseconds: 999,
      })
    );
    toast({
      description: 'All filters have been cleared.',
      color: 'success',
    });
  };

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

        {/* <div className='w-full flex flex-wrap gap-2 py-3'>
          <div className='min-w-[120px]'>
            <label className='text-sm font-medium mb-1 block'>
              Start Period
            </label>
            <DatePicker
              selected={startPeriod}
              onChange={(date) => {
                const newStart = date
                  ? setDate(startOfMonth(date), {
                      hours: 0,
                      minutes: 0,
                      seconds: 0,
                      milliseconds: 0,
                    })
                  : null;
                setStartPeriod(newStart);
                // Validasi: Jika endPeriod ada dan lebih awal dari newStart, reset endPeriod
                if (
                  newStart &&
                  endPeriod &&
                  startOfMonth(endPeriod) < startOfMonth(newStart)
                ) {
                  console.log(
                    'Resetting endPeriod because it is before new startPeriod:',
                    {
                      newStart: newStart.toISOString(),
                      endPeriod: endPeriod.toISOString(),
                    }
                  );
                  setEndPeriod(null);
                  toast({
                    description:
                      'End Period was reset because it was earlier than the new Start Period.',
                    color: 'destructive',
                  });
                }
              }}
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
                    ? setDate(endOfMonth(date), {
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
              placeholderText={format(endOfMonth(new Date()), 'MMM yyyy')} // Diperbaiki ke dinamis
              minDate={startPeriod ? startOfMonth(startPeriod) : undefined}
              className='w-[120px] h-10 px-3 border rounded-md'
              shouldCloseOnSelect={false}
              showYearDropdown
              yearDropdownItemNumber={15}
              scrollableYearDropdown
            />
          </div>
        </div> */}

        <div className='flex flex-col items-center space-y-2 w-full'>
          <PeriodFilter />
        </div>

        <div className='w-full py-3'>
          {table.getColumn('paidStatus') && (
            <DataTableFacetedFilter
              column={table.getColumn('paidStatus')}
              title='Status'
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
          )}
        </div>

        <div className='w-full py-3'>
          {table.getColumn('poType') && (
            <DataTableFacetedFilter
              column={table.getColumn('poType')}
              title='PO Type'
              options={poTypeOptionList}
              isLoading={isPoTypeLoading}
              disabled={salesPersonName.length > 1}
              selectedValues={new Set(poType)}
              onSelect={(value) => {
                const updatedValues = new Set(poType);
                value
                  ? updatedValues.has(value)
                    ? updatedValues.delete(value)
                    : updatedValues.add(value)
                  : updatedValues.clear();
                setPoType(Array.from(updatedValues));
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
              }}
            />
          )}
        </div>

        {table.getState().columnFilters.length > 0 && (
          <Button
            variant='outline'
            onClick={handleReset}
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

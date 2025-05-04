'use client';
import { useEffect, useRef } from 'react';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { set as setDate } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMonthYearPeriodStore } from '@/store';
import { useToast } from '@/components/ui/use-toast';

interface PeriodFilterProps {
  context: 'salesInvoice' | 'salesPersonInvoice';
  onPeriodChange?: (period: {
    startPeriod: Date | null;
    endPeriod: Date | null;
  }) => void;
}

export function PeriodFilter({ context, onPeriodChange }: PeriodFilterProps) {
  const {
    salesInvoicePeriod,
    setSalesInvoicePeriod,
    salesPersonInvoicePeriod,
    setSalesPersonInvoicePeriod,
  } = useMonthYearPeriodStore();
  const { toast } = useToast();

  const period =
    context === 'salesInvoice' ? salesInvoicePeriod : salesPersonInvoicePeriod;
  const setPeriod =
    context === 'salesInvoice'
      ? setSalesInvoicePeriod
      : setSalesPersonInvoicePeriod;

  const prevPeriodRef = useRef({
    startPeriod: period.startPeriod,
    endPeriod: period.endPeriod,
  });

  useEffect(() => {
    const prev = prevPeriodRef.current;
    if (
      period.startPeriod !== prev.startPeriod ||
      period.endPeriod !== prev.endPeriod
    ) {
      console.log(`[PeriodFilter:${context}] useEffect triggered with:`, {
        startPeriod: period.startPeriod,
        endPeriod: period.endPeriod,
      });
      onPeriodChange?.({
        startPeriod: period.startPeriod,
        endPeriod: period.endPeriod,
      });
      prevPeriodRef.current = {
        startPeriod: period.startPeriod,
        endPeriod: period.endPeriod,
      };
    }
  }, [period.startPeriod, period.endPeriod, onPeriodChange, context]);

  return (
    <div className='w-full flex justify-center items-center'>
      <div className='flex flex-wrap gap-2 py-3'>
        <div className='min-w-[120px]'>
          <label className='text-sm font-medium mb-1 block'>Start Period</label>
          <DatePicker
            selected={period.startPeriod}
            onChange={(date) => {
              console.log(`[${context}] Start Period changed to:`, date);
              const newStart = date
                ? setDate(startOfMonth(date), {
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    milliseconds: 0,
                  })
                : null;
              setPeriod({ startPeriod: newStart });
              if (
                newStart &&
                period.endPeriod &&
                startOfMonth(period.endPeriod) < startOfMonth(newStart)
              ) {
                setPeriod({ endPeriod: null });
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
            shouldCloseOnSelect={false}
            showYearDropdown
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            maxDate={endOfMonth(new Date())}
            className='w-[120px] h-10 px-3 border rounded-md bg-white text-gray-900 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 custom-datepicker'
          />
        </div>

        <div className='min-w-[120px]'>
          <label className='text-sm font-medium mb-1 block'>End Period</label>
          <DatePicker
            selected={period.endPeriod}
            onChange={(date) => {
              console.log(`[${context}] End Period changed to:`, date);
              setPeriod({
                endPeriod: date
                  ? setDate(endOfMonth(date), {
                      hours: 23,
                      minutes: 59,
                      seconds: 59,
                      milliseconds: 999,
                    })
                  : null,
              });
            }}
            showMonthYearPicker
            dateFormat='MMM yyyy'
            placeholderText={format(endOfMonth(new Date()), 'MMM yyyy')}
            minDate={
              period.startPeriod ? startOfMonth(period.startPeriod) : undefined
            }
            shouldCloseOnSelect={false}
            showYearDropdown
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            maxDate={endOfMonth(new Date())}
            className='w-[120px] h-10 px-3 border rounded-md bg-white text-gray-900 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 custom-datepicker'
          />
        </div>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useRef } from 'react';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { set as setDate } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMonthYearPeriodStore } from '@/store';
import { SearchContext } from '@/constants/searchContexts'; // Impor SearchContext
import { useToast } from '@/components/ui/use-toast';

interface PeriodFilterProps {
  context: SearchContext;
  onChange?: (
    period: Partial<{ startPeriod: Date | null; endPeriod: Date | null }>
  ) => void;
  value?: { startPeriod: Date | null; endPeriod: Date | null };
}

export function PeriodFilter({ context, onChange, value }: PeriodFilterProps) {
  const {
    salesInvoicePeriod,
    setSalesInvoicePeriod,
    salesPersonInvoicePeriod,
    setSalesPersonInvoicePeriod,
    purchasingPeriod,
    setPurchasingPeriod,
    inventoryPeriod,
    setInventoryPeriod,
  } = useMonthYearPeriodStore();
  const { toast } = useToast();

  // Gunakan value dari prop jika ada, jika tidak ambil dari store
  const period =
    value ||
    (context === 'salesInvoice'
      ? salesInvoicePeriod
      : context === 'salesPersonInvoice'
        ? salesPersonInvoicePeriod
        : context === 'purchasing'
          ? purchasingPeriod
          : inventoryPeriod);

  const prevPeriodRef = useRef({
    startPeriod: period.startPeriod,
    endPeriod: period.endPeriod,
  });

  // Default setter berdasarkan context jika tidak ada onChange
  const setPeriodDefault = (
    newPeriod: Partial<{ startPeriod: Date | null; endPeriod: Date | null }>
  ) => {
    switch (context) {
      case 'salesInvoice':
        setSalesInvoicePeriod(newPeriod);
        break;
      case 'salesPersonInvoice':
        setSalesPersonInvoicePeriod(newPeriod);
        break;
      // case 'purchasing':
      //   setPurchasingPeriod(newPeriod);
      //   break;
      // case 'inventory':
      //   setInventoryPeriod(newPeriod);
      //   break;
      default:
        console.warn(`Unknown context: ${context}`);
    }
  };

  // Handler untuk mengatur periode
  const setPeriod = onChange || setPeriodDefault;

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
      if (onChange) {
        onChange({
          startPeriod: period.startPeriod,
          endPeriod: period.endPeriod,
        });
      }
      prevPeriodRef.current = {
        startPeriod: period.startPeriod,
        endPeriod: period.endPeriod,
      };
    }
  }, [period.startPeriod, period.endPeriod, onChange, context]);

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

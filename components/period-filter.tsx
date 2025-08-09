'use client';
import { useEffect, useRef } from 'react';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { set as setDate } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMonthYearPeriodStore } from '@/store';
import { SearchContext } from '@/constants/searchContexts';
import { useToast } from '@/components/ui/use-toast';

// Definisikan tipe Period
interface Period {
  startPeriod: Date | null;
  endPeriod: Date | null;
}

interface PeriodFilterProps {
  context: SearchContext;
  onChange?: (period: Partial<Period>) => void;
  value?: Partial<Period>;
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

  const period: Partial<Period> =
    value ||
    (context === 'salesInvoice'
      ? salesInvoicePeriod
      : context === 'salesPersonInvoice'
        ? salesPersonInvoicePeriod
        : context === 'purchasing'
          ? purchasingPeriod
          : inventoryPeriod);

  const normalizedPeriod: Partial<Period> = {
    startPeriod: period.startPeriod ?? null,
    endPeriod: period.endPeriod ?? null,
  };

  const prevPeriodRef = useRef<Partial<Period>>({
    startPeriod: normalizedPeriod.startPeriod,
    endPeriod: normalizedPeriod.endPeriod,
  });

  // Hitung maxDate berdasarkan bulan saat ini
  const currentDate = new Date();

  const computedMinDate = new Date(currentDate.getFullYear(), 0, 1);

  const computedMaxDate =
    currentDate.getMonth() === 4 // 4 artinya Mei
      ? endOfMonth(new Date(currentDate.getFullYear(), 3, 1)) // April (3) pada tahun yang sama
      : endOfMonth(currentDate);

  const setPeriodDefault = (newPeriod: Partial<Period>) => {
    switch (context) {
      case 'salesInvoice':
        setSalesInvoicePeriod(newPeriod);
        break;
      case 'salesPersonInvoice':
        setSalesPersonInvoicePeriod(newPeriod);
        break;
      case 'purchasing':
        setPurchasingPeriod(newPeriod);
        break;
      case 'inventory':
        setInventoryPeriod(newPeriod);
        break;
      default:
        console.warn(`Unknown context: ${context}`);
    }
  };

  const setPeriod = onChange || setPeriodDefault;

  useEffect(() => {
    const prev = prevPeriodRef.current;
    if (
      normalizedPeriod.startPeriod !== prev.startPeriod ||
      normalizedPeriod.endPeriod !== prev.endPeriod
    ) {
      console.log(`[PeriodFilter:${context}] useEffect triggered with:`, {
        startPeriod: normalizedPeriod.startPeriod,
        endPeriod: normalizedPeriod.endPeriod,
      });
      if (onChange) {
        onChange({
          startPeriod: normalizedPeriod.startPeriod,
          endPeriod: normalizedPeriod.endPeriod,
        });
      }
      prevPeriodRef.current = {
        startPeriod: normalizedPeriod.startPeriod,
        endPeriod: normalizedPeriod.endPeriod,
      };
    }
  }, [
    normalizedPeriod.startPeriod,
    normalizedPeriod.endPeriod,
    onChange,
    context,
  ]);

  return (
    <div className='w-full space-y-2 flex flex-col items-center justify-center'>
      {/* Date Picker Container */}
      <div className='flex flex-col sm:flex-row gap-2 justify-center items-center'>
        {/* Start Period */}
        <div className='flex-1 min-w-0 max-w-[120px]'>
          <label className='text-xs font-medium text-foreground block mb-0.5'>
            Start Period
          </label>
          <DatePicker
            selected={normalizedPeriod.startPeriod}
            onChange={(date: Date | null) => {
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
                normalizedPeriod.endPeriod &&
                startOfMonth(normalizedPeriod.endPeriod) <
                  startOfMonth(newStart)
              ) {
                setPeriod({ endPeriod: null });
                toast({
                  description:
                    'End Period was reset because it was earlier than the new Start Period.',
                  variant: 'destructive',
                });
              }
            }}
            showMonthYearPicker
            dateFormat='MMM yyyy'
            placeholderText={format(computedMinDate, 'MMM yyyy')}
            shouldCloseOnSelect={false}
            showYearDropdown
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            maxDate={computedMaxDate}
            className='w-full h-7 px-1 text-xs border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-colors'
          />
        </div>

        {/* End Period */}
        <div className='flex-1 min-w-0 max-w-[120px]'>
          <label className='text-xs font-medium text-foreground block mb-0.5'>
            End Period
          </label>
          <DatePicker
            selected={normalizedPeriod.endPeriod ?? computedMaxDate}
            onChange={(date: Date | null) => {
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
            placeholderText={
              computedMaxDate ? format(computedMaxDate, 'MMM yyyy') : ''
            }
            minDate={
              normalizedPeriod.startPeriod
                ? startOfMonth(normalizedPeriod.startPeriod)
                : undefined
            }
            shouldCloseOnSelect={false}
            showYearDropdown
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            maxDate={computedMaxDate}
            className='w-full h-7 px-1 text-xs border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-colors'
          />
        </div>
      </div>

      {/* Selected Range Display */}
      {/* {(normalizedPeriod.startPeriod || normalizedPeriod.endPeriod) && (
        <div className='text-center'>
          <div className='inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-muted-foreground'>
            <span>Selected:</span>
            <span className='font-medium'>
              {normalizedPeriod.startPeriod
                ? format(normalizedPeriod.startPeriod, 'MMM yyyy')
                : 'Any'}
            </span>
            <span>to</span>
            <span className='font-medium'>
              {normalizedPeriod.endPeriod
                ? format(normalizedPeriod.endPeriod, 'MMM yyyy')
                : 'Any'}
            </span>
          </div>
        </div>
      )} */}
    </div>
  );
}

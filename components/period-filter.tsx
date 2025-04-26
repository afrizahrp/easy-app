// components/PeriodFilter.tsx
'use client';
import { useEffect } from 'react';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { set as setDate } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMonthYearPeriodStore } from '@/store';
import { useToast } from '@/components/ui/use-toast';

interface PeriodFilterProps {
  onPeriodChange?: () => void; // Callback opsional saat periode berubah
}

export function PeriodFilter({ onPeriodChange }: PeriodFilterProps) {
  const { startPeriod, setStartPeriod, endPeriod, setEndPeriod } =
    useMonthYearPeriodStore();
  const { toast } = useToast();

  useEffect(() => {
    onPeriodChange?.();
  }, [startPeriod, endPeriod, onPeriodChange]);

  return (
    <div className='w-full flex flex-wrap gap-2 py-3'>
      <div className='min-w-[120px]'>
        <label className='text-sm font-medium mb-1 block'>Start Period</label>
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
            if (
              newStart &&
              endPeriod &&
              startOfMonth(endPeriod) < startOfMonth(newStart)
            ) {
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
          placeholderText={format(endOfMonth(new Date()), 'MMM yyyy')}
          minDate={startPeriod ? startOfMonth(startPeriod) : undefined}
          className='w-[120px] h-10 px-3 border rounded-md'
          shouldCloseOnSelect={false}
          showYearDropdown
          yearDropdownItemNumber={15}
          scrollableYearDropdown
        />
      </div>
    </div>
  );
}

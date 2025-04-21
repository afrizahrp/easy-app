// MonthYearPicker.tsx
'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, getYear } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import './month-year-picker.css';

interface MonthYearPickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
}

export function MonthYearPicker({ value, onChange }: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-[200px] justify-start text-left font-normal'
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {value ? format(value, 'MMM, yyyy') : <span>Pilih bulan</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-2' align='start'>
        <DatePicker
          selected={value}
          onChange={(date: Date | null) => {
            onChange?.(date);
            setOpen(false);
          }}
          dateFormat='MM/yyyy'
          showMonthYearPicker
          inline
          renderCustomHeader={({ date, decreaseYear, increaseYear }) => (
            <div className='flex justify-between items-center px-2 py-1 mb-2'>
              <Button variant='ghost' size='icon' onClick={decreaseYear}>
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <span className='font-semibold text-sm'>{getYear(date)}</span>
              <Button variant='ghost' size='icon' onClick={increaseYear}>
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          )}
        />
      </PopoverContent>
    </Popover>
  );
}

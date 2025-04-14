// components/custom-date-picker.tsx

'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function CustomDatePicker() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = React.useState(
    date?.getMonth() ?? new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = React.useState(
    date?.getFullYear() ?? new Date().getFullYear()
  );

  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value);
    setCurrentMonth(newMonth);
  };

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value);
    setCurrentYear(newYear);
  };

  const handleDateSelect = (selectedDate?: Date) => {
    setDate(selectedDate);
    if (selectedDate) {
      setCurrentMonth(selectedDate.getMonth());
      setCurrentYear(selectedDate.getFullYear());
    }
  };

  // Generate list of years (adjust as needed)
  const years = Array.from({ length: 50 }, (_, i) => (2000 + i).toString());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-[250px] justify-start text-left font-normal'
        >
          {date ? format(date, 'PPP') : <span>Pilih tanggal</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-2' align='start'>
        <div className='flex space-x-2 mb-2'>
          <Select
            value={currentMonth.toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Bulan' />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className='w-[100px]'>
              <SelectValue placeholder='Tahun' />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode='single'
          selected={date}
          onSelect={handleDateSelect}
          month={new Date(currentYear, currentMonth)}
          onMonthChange={() => {}}
        />
      </PopoverContent>
    </Popover>
  );
}

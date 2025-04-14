'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface MonthYearPickerRangeProps {
  from?: Date;
  to?: Date;
  onChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export function MonthYearPickerRange({
  from,
  to,
  onChange,
}: MonthYearPickerRangeProps) {
  const [openPicker, setOpenPicker] = useState<'from' | 'to' | null>(null);

  const handleSelect = (type: 'from' | 'to', date: Date | undefined) => {
    const newRange = {
      from: type === 'from' ? date : from,
      to: type === 'to' ? date : to,
    };
    onChange(newRange);
    setOpenPicker(null);
  };

  return (
    <div className='flex gap-4'>
      {(['from', 'to'] as const).map((type) => (
        <Popover
          key={type}
          open={openPicker === type}
          onOpenChange={() => setOpenPicker(type)}
        >
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'w-[160px] justify-start text-left',
                !{ from, to }[type] && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {{ from, to }[type]
                ? format({ from, to }[type]!, 'MMMM yyyy')
                : `${type === 'from' ? 'From' : 'To'}`}
            </Button>
          </PopoverTrigger>
          <PopoverContent align='start' className='p-0'>
            <Calendar
              mode='single'
              selected={{ from, to }[type]}
              onSelect={(date) => handleSelect(type, date)}
              initialFocus
              captionLayout='dropdown-months'
              fromYear={2015}
              toYear={2030}
              disableNavigation={false}
              modifiersClassNames={{
                selected: 'bg-primary text-primary-foreground',
                today: 'border border-primary',
              }}
              classNames={{
                head_cell:
                  'text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]',
                cell: 'w-10 h-10 text-center text-sm p-0',
              }}
              month={type === 'from' ? from : to}
              fixedWeeks
              showOutsideDays={false}
            />
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}

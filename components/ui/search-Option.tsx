'use client';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface SearchOptionProps {
  value: string;
  onChange: (value: string) => void;
}

const SEARCH_FIELDS = ['id', 'name', 'remarks'];

export default function SearchOption({ value, onChange }: SearchOptionProps) {
  return (
    <div className='flex items-center space-x-2'>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className='h-8 w-[120px] text-sm'>
          <SelectValue placeholder='Search By' />
        </SelectTrigger>
        <SelectContent side='bottom'>
          {SEARCH_FIELDS.map((field) => (
            <SelectItem
              key={field}
              value={field}
              className='text-sm capitalize'
            >
              {field}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

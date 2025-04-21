import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SearchOptionItem } from '@/types';

interface SearchOptionProps {
  value: string;
  onChange: (value: string) => void;
  options: SearchOptionItem[];
  placeholder?: string;
}

export function SearchOption({
  value,
  onChange,
  options,
  placeholder = 'Search by',
}: SearchOptionProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='w-[120px]' title='Select search field'>
        <SelectValue placeholder='Search by' />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

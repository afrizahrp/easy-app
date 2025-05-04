// src/components/SearchOption.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchContext } from '@/constants/searchContexts';
import { useSearchParamsStore } from '@/store';

interface Option {
  value: string;
  label: string;
}

interface SearchOptionProps {
  options: Option[];
  placeholder?: string;
  context: SearchContext; // Tambahkan prop context
}

export function SearchOption({
  options,
  placeholder,
  context,
}: SearchOptionProps) {
  const { searchParams, setSearchParam } = useSearchParamsStore();
  const value = searchParams?.[context]?.searchBy || options[0]?.value || '';

  return (
    <Select
      value={value}
      onValueChange={(val) => {
        console.log(`SearchOption [${context}] selected: ${val}`);
        setSearchParam(context, 'searchBy', val);
      }}
    >
      <SelectTrigger className='w-[150px]'>
        <SelectValue placeholder={placeholder} />
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

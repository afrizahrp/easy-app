import * as React from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';
import { useCategoryFilterStore } from '@/store'; // ✅ Import store dari luar
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FilterIcon, Loader2 } from 'lucide-react';

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options?: { value: string; label: string; count?: number }[];
  isLoading?: boolean;
  table?: any;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  isLoading,
  table,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const { status, setStatus } = useCategoryFilterStore(); // ✅ Ambil dari Zustand

  const selectedValues = new Set(status); // Ambil filter dari Zustand

  const handleSelect = (optionValue: string) => {
    const updatedValues = new Set(selectedValues);

    if (updatedValues.has(optionValue)) {
      updatedValues.delete(optionValue);
    } else {
      updatedValues.add(optionValue);
    }

    const filterValues = Array.from(updatedValues);
    setStatus(filterValues); // ✅ Update Zustand store

    console.log('✅ Selected Filters:', filterValues);

    // 🔥 Panggil refetch untuk update data
    console.log('🔥 Calling Refetch Data...');
    table?.options?.meta?.refetchData?.();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={isLoading}
          variant='outline'
          size='sm'
          className='h-10 border-dashed text-sm text-primary w-full'
        >
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          <FilterIcon className='mr-2 h-4 w-4 text-sm' />
          Filter by {title}
          {selectedValues.size > 0 && (
            <Badge variant='outline' className='ml-2'>
              {selectedValues.size}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[full] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No data</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <CheckIcon
                    className={
                      selectedValues.has(option.value)
                        ? 'h-4 w-4 text-primary'
                        : 'invisible'
                    }
                  />
                  <span>{option.label}</span>
                  {option.count !== undefined && (
                    <span className='ml-auto text-xs'>{option.count}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setStatus([])} // ✅ Clear filter dengan Zustand
                    className='text-center'
                  >
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

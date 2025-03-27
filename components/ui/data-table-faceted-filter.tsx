import * as React from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';
import { useCategoryFilterStore } from '@/store';
import { cn } from '@/lib/utils';
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
import { Separator } from '@/components/ui/separator';
import { FilterIcon, Loader2 } from 'lucide-react';

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options?: { value: string; label: string; count?: number }[];
  isLoading?: boolean;
  filterType: 'status' | 'categoryType'; // 🔥 Tambahkan filterType
  table?: any;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  isLoading,
  filterType, // 🔥 Gunakan filterType untuk menentukan store yang digunakan
  table,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const { status, setStatus, categoryType, setCategoryType } =
    useCategoryFilterStore();

  // 🔥 Pilih state sesuai dengan filterType
  const selectedValues =
    filterType === 'status' ? new Set(status) : new Set(categoryType);

  const handleSelect = (optionValue: string) => {
    const updatedValues = new Set(selectedValues);

    if (updatedValues.has(optionValue)) {
      updatedValues.delete(optionValue);
    } else {
      updatedValues.add(optionValue);
    }

    const filterValues = Array.from(updatedValues);

    if (filterType === 'status') {
      setStatus(filterValues); // 🔥 Update status
    } else {
      setCategoryType(filterValues); // 🔥 Update categoryType
    }

    column?.setFilterValue(filterValues.length ? filterValues : undefined);

    // 🔥 Panggil refetch data
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
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge variant='outline' className='rounded-sm px-1 font-normal'>
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>

      {selectedValues.size > 0 && (
        <div className='hidden space-x-1 py-3 lg:flex'>
          {selectedValues.size > 3 ? (
            <Badge variant='outline' className='rounded-sm px-1 font-normal'>
              {selectedValues.size} data filtered
            </Badge>
          ) : (
            options
              ?.filter((option) => selectedValues.has(option.value))
              .map((option) => (
                <Badge
                  variant='outline'
                  key={option.value}
                  className='rounded-sm px-1 text-sm'
                >
                  {option.label}
                </Badge>
              ))
          )}
        </div>
      )}

      <PopoverContent className='w-[full] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No data</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50'
                      )}
                    >
                      <CheckIcon
                        className={cn(
                          'h-4 w-4 text-slate-400',
                          isSelected ? '' : 'invisible'
                        )}
                      />
                    </div>

                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className='ml-auto text-xs'>{option.count}</span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      if (filterType === 'status') {
                        setStatus([]);
                      } else {
                        setCategoryType([]);
                      }
                      column?.setFilterValue(undefined);
                    }}
                    className='justify-center text-center'
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

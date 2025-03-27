import * as React from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';

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
import { FilterIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options?: {
    value: string;
    label: string;
    count?: number;
  }[];
  isLoading?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  isLoading,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  // console.log('Table Unique Values:', column?.getFacetedUniqueValues());
  // console.log('Table Facets:', facets);
  console.log('Table Filter Value:', column?.getFilterValue());
  console.log('Selected Filters:', selectedValues);

  const optionsValue = options || []; // Provide [] as a default value

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={isLoading}
          variant='outline'
          size='sm'
          className='h-10 border-dashed text-sm text-primary w-full items-center justify-center'
        >
          {isLoading && (
            <Loader2
              className='mr-2 h-4 w-4 animate-spin'
              aria-label='Loading...'
            />
          )}{' '}
          <FilterIcon className='mr-2 h-4 w-4 text-sm' />
          Filter data by {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='outline'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>

      {selectedValues?.size > 0 && (
        <div className='hidden space-x-1 py-3 lg:flex'>
          {selectedValues.size > 3 ? (
            <Badge variant='outline' className='rounded-sm px-1 font-normal'>
              {selectedValues.size} data filtered
            </Badge>
          ) : (
            optionsValue
              .filter((option) => selectedValues.has(option.value))
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
              {optionsValue.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      // Konversi Set ke Array agar React Table bisa mengenali perubahan
                      const updatedValues = new Set(selectedValues);

                      if (updatedValues.has(option.value)) {
                        updatedValues.delete(option.value);
                      } else {
                        updatedValues.add(option.value);
                      }

                      // Pastikan format filter sesuai dengan nilai di tabel
                      const filterValues = Array.from(updatedValues);

                      console.log('Selected Filters:', filterValues); // Debugging

                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
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
                    {/* Menampilkan count dari CategoryFilterSidebar */}
                    {option.count !== undefined && (
                      <span className='ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs'>
                        {option.count}
                      </span>
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
                    onSelect={() => column?.setFilterValue(undefined)}
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

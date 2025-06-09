'use client';

import * as React from 'react';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
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
import { months } from '@/utils/monthNameMap';

interface MonthFacetedFilterProps {
  title?: string;
  options: { value: string; label: string; count?: number }[];
  isLoading?: boolean;
  disabled?: boolean;
  selectedValues: Set<string>;
  onSelect: (value: string) => void;
  ariaLabel?: string;
}

export function MonthFacetedFilter({
  title = 'Filter by Month',
  options = [
    { value: 'all', label: 'All Months' },
    ...months.map((month) => ({ value: month.toLowerCase(), label: month })),
  ],
  isLoading,
  disabled,
  selectedValues,
  onSelect,
  ariaLabel,
}: MonthFacetedFilterProps) {
  const defaultMonths = months.map((month) => month.toLowerCase());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={isLoading || disabled}
          variant='outline'
          size='sm'
          className='h-10 text-sm bg-secondary text-slate w-full dark:text-slate-400 dark:bg-secondary'
          aria-label={ariaLabel}
        >
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          <FilterIcon className='mr-2 h-4 w-4 text-sm' />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator
                orientation='vertical'
                className='mx-2 h-4 text-slate dark:text-slate-400'
              />
              <Badge
                variant='outline'
                className='rounded-sm px-1 font-normal text-slate dark:text-slate-400'
              >
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      {selectedValues.size > 0 && (
        <div className='hidden space-x-1 py-3 lg:flex'>
          {selectedValues.size > 3 ? (
            <Badge
              variant='outline'
              className='rounded-sm px-1 font-normal text-slate dark:text-slate-400'
            >
              {selectedValues.size} months selected
            </Badge>
          ) : (
            options
              ?.filter((option) => selectedValues.has(option.value))
              .map((option) => {
                const isDefaultMonth =
                  defaultMonths.includes(option.value) ||
                  option.value === 'all';
                return (
                  <Badge
                    variant='outline'
                    key={option.value}
                    className='rounded-sm px-1 text-xs text-slate-600'
                  >
                    {option.label}
                    {!isDefaultMonth && (
                      <Cross2Icon
                        className='ml-1 h-3 w-3 cursor-pointer text-red-500'
                        onClick={() => {
                          onSelect(option.value);
                          console.log('Cross2Icon Clicked:', {
                            value: option.value,
                          });
                        }}
                      />
                    )}
                  </Badge>
                );
              })
          )}
        </div>
      )}

      <PopoverContent className='w-full p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No months found</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => !disabled && onSelect(option.value)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-slate-700 dark:text-slate-400'
                          : 'opacity-50'
                      )}
                    >
                      <CheckIcon
                        className={cn(
                          'h-4 w-4 text-slate-400 bg-primary dark:bg-secondary',
                          isSelected ? '' : 'invisible'
                        )}
                      />
                    </div>
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className='ml-auto text-xs text-slate-700 dark:text-slate-400'>
                        {option.count.toLocaleString('id-ID')}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 &&
              !defaultMonths.every((month) => selectedValues.has(month)) &&
              !selectedValues.has('all') && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => !disabled && onSelect('')}
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

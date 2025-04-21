'use client';

import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import SearchInput from '@/components/ui/search-Input';
import FilterSidebar from './filter-sidebar';
import { SearchOption } from './search-Option';
import { useSearchParamsStore } from '@/store';
import { useSalesInvoiceHdFilterStore } from '@/store';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  href: string;
  hrefText?: string;
  placeholder?: string;
  onFilterClick: () => void;
  limit: number;
  setLimit: (limit: number) => void;
  columnLabels?: Record<string, string>;
  searchOptionItem: Record<string, string>;
  open: boolean;
  handleSheetOpen: () => void;
  pageName?: string;
}

function toSearchOptionArray(options: Record<string, string>) {
  return Object.entries(options).map(([value, label]) => ({ value, label }));
}

export function DataTableToolbar<TData>({
  table,
  href,
  hrefText,
  placeholder,
  onFilterClick,
  open,
  handleSheetOpen,
  pageName,
  columnLabels,
  searchOptionItem,
}: DataTableToolbarProps<TData>) {
  const { searchParams, setSearchBy } = useSearchParamsStore();
  const { startPeriod, setStartPeriod, endPeriod, setEndPeriod } =
    useSalesInvoiceHdFilterStore();
  const searchBy = (searchParams.searchBy as string) || 'id';

  const searchOptions = toSearchOptionArray(searchOptionItem);

  return (
    <div className='flex flex-col gap-2 w-full'>
      {/* StartPeriod dan EndPeriod di baris terpisah di atas */}
      <div className='w-full flex flex-wrap gap-2'>
        <div className='min-w-[200px]'>
          <label className='text-sm font-medium mb-1 block'>Start Period</label>
          <DatePicker
            selected={startPeriod}
            onChange={(date) => setStartPeriod(date)}
            showMonthYearPicker
            dateFormat='MMM yyyy'
            placeholderText='Select start period'
            className='w-[200px] h-10 px-3 border rounded-md'
          />
        </div>
        <div className='min-w-[200px]'>
          <label className='text-sm font-medium mb-1 block'>End Period</label>
          <DatePicker
            selected={endPeriod}
            onChange={(date) => setEndPeriod(date)}
            showMonthYearPicker
            dateFormat='MMM yyyy'
            placeholderText='Select end period'
            minDate={startPeriod || undefined} // Validasi: endPeriod tidak boleh sebelum startPeriod
            className='w-[200px] h-10 px-3 border rounded-md'
          />
        </div>
      </div>

      {/* Elemen lainnya di bawah */}
      <div className='flex flex-wrap items-center gap-2 sm:gap-4 w-full'>
        <FilterSidebar
          table={table}
          open={open}
          onClose={handleSheetOpen}
          pageName={pageName}
        />
        <div className='flex items-center space-x-2'>
          <SearchOption
            value={searchBy}
            onChange={setSearchBy}
            options={searchOptions}
            placeholder='Search by'
          />
        </div>
        <div className='flex-1 min-w-[200px]'>
          <SearchInput
            className='w-full'
            placeholder={placeholder}
            searchBy={searchBy}
          />
        </div>
        <div className='flex flex-wrap items-center gap-2 ml-auto w-full sm:w-auto'>
          <Button
            size='sm'
            onClick={onFilterClick}
            className='px-3 h-8 flex items-center gap-1'
          >
            <Filter className='w-4 h-4' />
            <span className='hidden sm:inline'>Filter data</span>
          </Button>
          <DataTableViewOptions table={table} columnLabels={columnLabels} />
          {hrefText !== 'none' && (
            <Button
              size='sm'
              asChild
              className='px-3 h-8 flex items-center gap-1'
            >
              <Link href={href}>
                <Plus className='w-4 h-4' />
                <span className='hidden sm:inline'>{hrefText}</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

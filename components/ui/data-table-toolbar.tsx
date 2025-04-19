// DataTableToolbar.tsx

import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import SearchInput from '@/components/ui/seacrh-Input';
import FilterSidebar from './filter-sidebar';
import { SearchOption } from './search-Option';
import { useSearchParamsStore } from '@/store';

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
  const searchBy = (searchParams.searchBy as string) || 'id';

  const searchOptions = toSearchOptionArray(searchOptionItem);

  return (
    <div className='flex flex-wrap items-center gap-2 sm:gap-4 w-full'>
      {/* Sidebar Filter */}
      <FilterSidebar
        table={table}
        open={open}
        onClose={handleSheetOpen}
        pageName={pageName}
      />

      {/* Search Option Selector */}
      <div className='flex items-center space-x-2'>
        <SearchOption
          value={searchBy}
          onChange={setSearchBy}
          options={searchOptions}
          placeholder='Search by'
        />
      </div>

      {/* Search Input */}
      <div className='flex-1 min-w-[200px]'>
        <SearchInput
          className='w-full'
          placeholder={placeholder}
          searchBy={searchBy}
        />
      </div>

      {/* Actions: Filter, View Options, Add */}
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
  );
}

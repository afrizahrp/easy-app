import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import SearchInput from '@/components/ui/search-Input';
import FilterSidebar from './filter-sidebar';
import { SearchOption } from './search-Option';
import { SearchContext } from '@/constants/searchContexts';
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
  context: SearchContext; // Tambahkan prop context
  showFilterButton: boolean; // Tambahkan prop showFilterButton
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
  context,
  showFilterButton,
}: DataTableToolbarProps<TData>) {
  const { searchParams, setSearchParam } = useSearchParamsStore();

  const currentSearchBy = searchParams?.[context]?.searchBy || 'invoice_id'; // Gunakan context secara dinamis

  const searchOptions = toSearchOptionArray(searchOptionItem);
  return (
    <div className='flex flex-wrap items-center gap-2 sm:gap-4 w-full'>
      {/* Sidebar Filter */}
      {showFilterButton && (
        <FilterSidebar
          table={table}
          open={open}
          onClose={handleSheetOpen}
          pageName={pageName}
        />
      )}

      {/* Filter Button */}

      {/* Search Option Selector */}
      <div className='flex items-center space-x-2'>
        <SearchOption
          options={searchOptions}
          placeholder='Search by'
          context={context}
        />
      </div>

      {/* Search Input */}
      <div className='flex-1 min-w-[200px]'>
        <SearchInput
          className='w-full'
          placeholder={placeholder}
          searchBy={currentSearchBy}
          context={context}
        />
      </div>

      {/* Actions: Filter, View Options, Add */}
      <div className='flex flex-wrap items-center gap-2 ml-auto w-full sm:w-auto'>
        {showFilterButton && (
          <Button
            size='sm'
            onClick={onFilterClick}
            className='px-3 h-8 flex items-center gap-1'
          >
            <Filter className='w-4 h-4' />
            <span className='hidden sm:inline'>Filter data</span>
          </Button>
        )}

        {/* View Options */}

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

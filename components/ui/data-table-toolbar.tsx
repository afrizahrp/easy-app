import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import SearchInput from '@/components/ui/seacrhInput';
import FilterSidebar from './filter-sidebar';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  href: string;
  hrefText?: string;
  onFilterClick: () => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export function DataTableToolbar<TData>({
  table,
  href,
  hrefText,
  onFilterClick,
  limit,
  setLimit,
  open,
  handleSheetOpen,
  pageName,
}: DataTableToolbarProps<TData> & {
  open: boolean;
  handleSheetOpen: () => void;
  pageName?: string;
}) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full'>
      {/* Sidebar Filter */}
      <FilterSidebar
        table={table}
        open={open}
        onClose={handleSheetOpen}
        pageName={pageName}
      />

      {/* Kiri: Dropdown & Pencarian */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm whitespace-nowrap'>Show</p>
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              setLimit(Number(value));
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[5, 10, 20].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pencarian */}
        <div className='w-full sm:w-auto'>
          <SearchInput className='w-full sm:w-auto' />
        </div>
      </div>

      {/* Kanan: Tombol Filter, View Options, dan Tambah Data */}
      <div className='flex flex-wrap items-center gap-2 ml-auto'>
        <Button
          size='sm'
          variant='outline'
          onClick={onFilterClick}
          className='px-3 h-8 flex items-center gap-1'
        >
          <Filter className='w-4 h-4' />
          <span className='hidden sm:inline'>Filter</span>
        </Button>

        <DataTableViewOptions table={table} />

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

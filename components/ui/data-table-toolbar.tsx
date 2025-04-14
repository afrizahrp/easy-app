import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import SearchInput from '@/components/ui/seacrh-Input';
import FilterSidebar from './filter-sidebar';
import SearchOption from './search-Option';
import { useState } from 'react';

// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from '@/components/ui/select';
// import PageSizeSelector from './pageSize-selector';

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
  // const searchBy = table.getColumn('searchBy')?.getFilterValue() as string;
  const [searchBy, setSearchBy] = useState('name'); // default field pencarian

  return (
    <div className='flex flex-wrap items-center gap-2 sm:gap-4 w-full'>
      {/* Sidebar Filter */}
      <FilterSidebar
        table={table}
        open={open}
        onClose={handleSheetOpen}
        pageName={pageName}
      />

      {/* <div className='flex items-center space-x-2'>
        <SearchOption
          value={searchBy}
          onChange={(value) => {
            setSearchBy(value); // ubah state lokal, bukan lewat column filter
          }}
        />
      </div> */}

      {/* Pencarian */}
      <div className='flex-1 min-w-[200px]'>
        <SearchInput className='w-full' searchBy={searchBy} />
      </div>
      {/* </div> */}

      {/* Tombol Filter, View Options, dan Tambah Data */}
      <div className='flex flex-wrap items-center gap-2 ml-auto w-full sm:w-auto'>
        <Button
          size='sm'
          // variant='outline'
          onClick={onFilterClick}
          className='px-3 h-8 flex items-center gap-1'
        >
          <Filter className='w-4 h-4' />
          <span className='hidden sm:inline'>Filter data</span>
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

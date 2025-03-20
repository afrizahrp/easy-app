'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
// import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

// function toggleColumnVisibility(headerTitle: string) {
//   const column = table.getColumn(headerTitle);
//   column.toggleVisibility();
// }

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          // className='ml-auto hidden h-8 lg:flex'
          className='ml-auto mx-2 my-1 px-5 h-8 lg:flex'
        >
          <MixerHorizontalIcon className='mr-2 h-4 w-4 flex' />
          Show Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        <DropdownMenuLabel> Show Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()

          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )

          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                aria-multiselectable='true'
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

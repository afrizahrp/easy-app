'use client';
import * as React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import masterTableStatusOptions from '@/data/masterTableStatusOptions';
import categoryTypeOptions from '@/data/categoryTypeOptions';

interface CategoryFilterSidebarProps<TData> {
  table: Table<TData>;
}

export function CategoryFilterSidebar<TData>({
  table,
}: CategoryFilterSidebarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { options: statusOptionList, isLoading: isStatusLoading } =
    masterTableStatusOptions();
  const { options: categoryTypeOption, isLoading: isCategoryTypeLoading } =
    categoryTypeOptions({ filterData: 1 });

  return (
    <div className='flex items-center justify-end py-2 '>
      <div className='flex flex-col items-center space-y-2 w-full'>
        <div className='w-full py-3'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={statusOptionList}
              isLoading={isStatusLoading}
            />
          )}
        </div>
        <div className='w-full py-1'>
          {table.getColumn('categoryType') && (
            <DataTableFacetedFilter
              column={table.getColumn('categoryType')}
              title='Category Type'
              options={categoryTypeOption}
              isLoading={isCategoryTypeLoading}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='outline'
            onClick={() => table.resetColumnFilters()}
            className='h-10 px-2 lg:px-3 w-full mb-5'
          >
            <Cross2Icon className='ml-2 h-4 w-4' />
            Reset Filter
          </Button>
        )}
      </div>
    </div>
  );
}

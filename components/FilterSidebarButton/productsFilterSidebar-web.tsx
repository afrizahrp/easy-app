'use client';
import * as React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import masterShowedStatusOptions from '@/data/masterShowedStatusOptions';
import productCategoryOptions from '@/data/productCategoryOptions';


interface ProductsFilterSidebarWebProps<TData> {
  table: Table<TData>;
}

export function ProductsFilterSidebarWeb<TData>({
  table,
}: ProductsFilterSidebarWebProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { options: statusOptionList, isLoading: isStatusLoading 
  } = masterShowedStatusOptions({ filterData: 1 });
    const {
      options: ProductCategoriesOption,
      isLoading: isProductCategoriesLoading,
    } = productCategoryOptions({ filterData: 1 });

  return (
    <div className='flex items-center justify-end py-2 '>
      <div className='flex flex-col items-center space-y-2 w-full'>
        <div className='w-full py-3'>
          {table.getColumn('showStatus') && (
            <DataTableFacetedFilter
              column={table.getColumn('showStatus')}
              title='Displayed Status'
              options={statusOptionList}
              isLoading={isStatusLoading}
            />
          )}
        </div>

        <div className='w-full py-1'>
          {table.getColumn('category') && (
            <DataTableFacetedFilter
              column={table.getColumn('category')}
              title='Category'
              options={ProductCategoriesOption}
              isLoading={isProductCategoriesLoading}
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

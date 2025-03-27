'use client';
import * as React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import useCategoryStatusOptions from '@/queryHooks/useCategoryStatusOptions';
import { Skeleton } from '@/components/ui/skeleton'; // ✅ Tambahkan Skeleton untuk loading state

interface CategoryFilterSidebarProps<TData> {
  table: Table<TData>;
}

export function CategoryFilterSidebar<TData>({
  table,
}: CategoryFilterSidebarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // ✅ Hitung jumlah data berdasarkan status yang ada di tabel (lokal dari data yang sedang ditampilkan)
  const statusCounts = table
    .getCoreRowModel()
    .rows.reduce<Record<string, number>>((acc, row) => {
      const status = row.getValue<string>('iStatus');
      if (status) {
        acc[status] = (acc[status] || 0) + 1;
      }
      return acc;
    }, {});

  // ✅ Ambil status dari API, sambil menyertakan statusCounts
  const { options: statusOptionList, isLoading: isStatusLoading } =
    useCategoryStatusOptions(statusCounts);

  // console.log('API Status List:', statusOptionList); // ✅ Debugging data dari API

  return (
    <div className='flex items-center justify-end py-2'>
      <div className='flex flex-col items-center space-y-2 w-full'>
        <div className='w-full py-3'>
          {table.getColumn('iStatus') ? (
            isStatusLoading ? (
              <Skeleton className='h-10 w-full' /> // ✅ Tambahkan loader saat API masih loading
            ) : (
              <DataTableFacetedFilter
                column={table.getColumn('iStatus')}
                title='Status'
                options={statusOptionList} // ✅ Gunakan data dari API
              />
            )
          ) : null}
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

'use client';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import useCategoryStatusOptions from '@/queryHooks/useCategoryStatusOptions';
import { useCategoryFilterStore } from '@/store'; // ✅ Gunakan Zustand Store

interface CategoryFilterSidebarProps<TData> {
  table: Table<TData>;
}

export function CategoryFilterSidebar<TData>({
  table,
}: CategoryFilterSidebarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // ✅ Ambil state filter dari Zustand
  const { status, setStatus } = useCategoryFilterStore();

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

  return (
    <div className='flex items-center justify-end py-2'>
      <div className='flex flex-col items-center space-y-2 w-full'>
        <div className='w-full py-3'>
          {table.getColumn('iStatus') && (
            <DataTableFacetedFilter
              column={table.getColumn('iStatus')}
              title='Status'
              options={statusOptionList}
              table={table}
            />
          )}
        </div>

        {isFiltered && (
          <Button
            variant='outline'
            onClick={() => {
              table.resetColumnFilters(); // ✅ Reset filter di tabel
              setStatus([]); // ✅ Reset filter di Zustand
            }}
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

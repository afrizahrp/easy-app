'use client';
import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSearchParamsStore } from '@/store';

import SearchInput from '@/components/ui/seacrhInput';

import { Filter } from 'lucide-react';

import FilterSidebar from './filter-sidebar';

import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';

import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { Plus } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  href: string;
  hrefText?: string;
  pageName?: string;
  currentPage: number;
  totalPages: number;
  totalRecords: number | undefined;
  onPageChange: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export function DataTableOLD<TData, TValue>({
  columns,
  data,
  href,
  hrefText,
  pageName,
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  limit,
  setLimit,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [filtering, setFiltering] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const setSearchParam = useSearchParamsStore((state) => state.setSearchParam);
  const removeSearchParam = useSearchParamsStore(
    (state) => state.removeSearchParam
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [open, setOpen] = React.useState<boolean>(false);
  const handleSheetOpen = () => {
    setOpen(!open);
  };

  const handleSearch = React.useCallback(
    (value: string) => {
      setFiltering(value);
      setSearchParam('name', value);
    },
    [setSearchParam]
  ); // Pastikan tidak bergantung pada `filtering` agar tidak memicu re-render

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      rowSelection,
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <div>
        <div className='flex flex-col md:flex-row  gap-4'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm '>Show</p>
            <Select
              value={`${limit}`}
              onValueChange={(value) => {
                setLimit(Number(value));
                table.setPageSize(Number(value)); // Terapkan ke react-table
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

          <div className='flex md:w-full sm:w-1/2 lg:w-full relative'>
            <SearchInput />
          </div>

          <div className='flex-none flex flex-col sm:flex-row sm:items-center  gap-4'>
            <Button
              size='sm'
              variant='outline'
              onClick={handleSheetOpen}
              className='ml-auto mx-2 my-1 px-5 h-8 lg:flex'
            >
              <Filter />
              Filter data
            </Button>

            <DataTableViewOptions table={table} />

            {hrefText !== 'none' && (
              <Button
                size='sm'
                asChild
                className='ml-auto mx-2 my-1 px-5 h-8 lg:flex sm:w-auto'
              >
                <Link href={href}>
                  <Plus className='w-3 h-3 mr-2' />
                  {hrefText}
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className='pt-1'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No data filtered
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex justify-between items-center mt-4'>
          <div className='text-xs'>Total data: {totalRecords}</div>
          <div className='ml-auto'>
            <DataTablePagination
              // currentPage={currentPage}
              table={table}
              totalRecords={totalRecords}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
      <FilterSidebar
        table={table}
        open={open}
        onClose={handleSheetOpen}
        pageName={pageName}
      />
    </>
  );
}

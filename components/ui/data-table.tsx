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

import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { SearchContext } from '@/constants/searchContexts';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  href: string;
  hrefText?: string;
  placeholder?: string;
  pageName?: string;
  currentPage: number;
  totalPages: number;
  totalRecords: number | undefined;
  onPageChange: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  sorting: SortingState; // Tambah prop

  setSorting: (
    sorting: SortingState | ((old: SortingState) => SortingState)
  ) => void;
  columnLabels?: Record<string, string>;
  searchOptionItem: Record<string, string>;
  context: SearchContext; // Tambahkan prop context
}

export function DataTable<TData, TValue>({
  columns,
  data,
  href,
  hrefText,
  placeholder,
  pageName,
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  limit,
  setLimit,
  sorting, // Gunakan dari props
  setSorting, // Gunakan dari props
  columnLabels,
  searchOptionItem,
  context,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [filtering, setFiltering] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [open, setOpen] = React.useState<boolean>(false);
  const handleSheetOpen = () => {
    setOpen(!open);
  };

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

    manualSorting: true, // <- penting jika sorting dikirim ke backend
  });

  return (
    <>
      <div className='space-y-4'>
        <DataTableToolbar<TData>
          table={table}
          href={href}
          hrefText={hrefText}
          placeholder={placeholder}
          onFilterClick={handleSheetOpen}
          limit={limit}
          setLimit={setLimit}
          open={open}
          handleSheetOpen={handleSheetOpen}
          pageName={pageName}
          columnLabels={columnLabels} // Pass columnLabels ke DataTableToolbar
          searchOptionItem={searchOptionItem} // Pass searchOptionItem ke DataTableToolbar
          context={context} // Pass context ke DataTableToolbar
        />

        <div className='rounded-md border'>
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
          <div className='text-xs text-muted-foreground'>
            Total data: {(totalRecords ?? 0).toLocaleString('id-ID')}
          </div>

          <div className='ml-auto'>
            <DataTablePagination
              table={table}
              limit={limit}
              setLimit={setLimit}
              totalRecords={totalRecords}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

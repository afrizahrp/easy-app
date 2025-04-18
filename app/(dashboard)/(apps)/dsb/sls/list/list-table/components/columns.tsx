'use client';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { format } from 'date-fns';

import { getStatusColor } from '@/utils/statusUils';

import Link from 'next/link';

export type SalesInvoiceHdColumns = {
  invoiceDate: Date;
  invoice_id: string;
  customerName: string;
  salesPersonName: string;
  invoiceType: string;
  paidStatus: string;
  total_amount: number;
};

export const columns: ColumnDef<SalesInvoiceHdColumns>[] = [
  {
    accessorKey: 'invoice_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Id' />
    ),
    cell: ({ row }) => (
      <Link
        href={`/inventory/categories/${row.getValue('invoice_id')}`}
        className='text-primary-600 dark:text-primary-400'
      >
        {row.getValue('invoice_id')}
      </Link>
    ),
    enableHiding: false,
    enableSorting: true, // pastikan ini ada
  },
  {
    accessorKey: 'invoiceDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue('invoiceDate');
      const formattedDate =
        rawDate instanceof Date
          ? format(rawDate, 'dd/MM/yyyy')
          : format(new Date(rawDate as string | number), 'dd/MM/yyyy');

      return (
        <Link
          href={`/inventory/categories/${row.getValue('invoice_id')}`}
          className='text-primary-600 dark:text-primary-400'
        >
          {formattedDate}
        </Link>
      );
    },
    enableSorting: true, // pastikan ini ada
    enableHiding: false,
  },

  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => {
      const customerName = String(row.getValue('customerName'));
      const displayName =
        customerName.length > 30
          ? `${customerName.substring(0, 30)}...`
          : customerName;

      return (
        <div className='flex space-x-1'>
          <span className={cn('max-w-[450px] truncate font-sm')}>
            {displayName}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'total_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total' />
    ),
    cell: ({ row }) => {
      const amount = row.getValue('total_amount');
      const formatted = !isNaN(Number(amount))
        ? new Intl.NumberFormat('id-ID').format(Number(amount))
        : '-';
      return <div className='text-right tabular-nums'>{formatted}</div>;
    },
    meta: {
      align: 'right', // optional, kalau kamu pakai sistem align via meta
    },
  },
  {
    accessorKey: 'paidStatus',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Status'
        className='text-black dark:text-slate-300'
      />
    ),
    cell: ({ row }) => {
      let value: string = row.getValue('paidStatus');
      const color = getStatusColor(value);
      return (
        <div className='w-[140px]'>
          <span
            className={cn(
              'inline-block h-3 w-3 rounded-full mr-2 dark:text-slate-300',
              color
            )}
          ></span>
          {value}
        </div>
      );
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'salesPersonName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sales Person' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <span className={cn('max-w-[450px] truncate font-sm')}>
            {row.getValue('salesPersonName')}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'invoiceType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <span className={cn('max-w-[450px] truncate font-sm')}>
            {row.getValue('invoiceType')}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

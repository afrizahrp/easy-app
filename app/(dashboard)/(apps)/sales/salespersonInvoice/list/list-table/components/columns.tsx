'use client';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { format, isValid } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getStatusColor } from '@/utils/statusUils';
import Link from 'next/link';

export type SalesPersonInvoiceListColumns = {
  poType: string;
  po_id: string;
  invoiceDate: Date;
  invoice_id: string;
  customerName: string;
  salesPersonName: string;
  total_amount: number;
  paidStatus: string;
};

export const columns: ColumnDef<SalesPersonInvoiceListColumns>[] = [
  {
    accessorKey: 'poType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Po Type' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-1'>
        <span className={cn('max-w-[450px] truncate font-sm')}>
          {row.getValue('poType')}
        </span>
      </div>
    ),
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: 'po_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Po Id' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-1'>
        <span className={cn('max-w-[450px] truncate font-sm')}>
          {row.getValue('po_id')}
        </span>
      </div>
    ),
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'invoice_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Invoice id' />
    ),
    cell: ({ row }) => (
      <Link
        href={`/sls/invoice-dt/${encodeURIComponent(row.getValue('invoice_id'))}`}
        className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 font-semibold'
      >
        {row.getValue('invoice_id')}
      </Link>
    ),
    enableHiding: false,
    enableSorting: true,
  },
  {
    accessorKey: 'invoiceDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue('invoiceDate');
      let formattedDate: string;
      try {
        const date =
          rawDate instanceof Date ? rawDate : new Date(rawDate as string);
        formattedDate = isValid(date)
          ? format(date, 'dd/MM/yyyy')
          : 'Invalid Date';
      } catch (error) {
        console.warn(`Error formatting invoiceDate: ${rawDate}`, error);
        formattedDate = 'Invalid Date';
      }
      return formattedDate;
    },
    enableSorting: true,
    enableHiding: false,
    filterFn: (
      row,
      id,
      filterValue: { start: Date; end: Date } | undefined
    ) => {
      if (!filterValue || !filterValue.start || !filterValue.end) {
        return true;
      }
      const rawDate = row.getValue(id);
      let rowDate: Date;
      try {
        rowDate =
          rawDate instanceof Date ? rawDate : new Date(rawDate as string);
      } catch (error) {
        console.warn(
          `Error parsing invoiceDate for invoice_id=${row.original.invoice_id}: ${rawDate}`,
          error
        );
        return false;
      }
      const isInRange =
        rowDate >= filterValue.start && rowDate <= filterValue.end;
      // Log hanya untuk faktur di Jan 2025

      return isInRange;
    },
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => {
      const customerName = String(row.getValue('customerName')).trim();
      const displayName =
        customerName.length > 36
          ? `${customerName.substring(0, 36)}...`
          : customerName;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex space-x-1'>
                <span className={cn('max-w-[450px] truncate font-xs')}>
                  {displayName}
                </span>
              </div>
            </TooltipTrigger>
            {customerName.length > 36 && (
              <TooltipContent>
                <p>{customerName}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'salesPersonName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sales Person' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-1'>
        <span className={cn('max-w-[450px] truncate font-sm')}>
          {row.getValue('salesPersonName')}
        </span>
      </div>
    ),
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'total_amount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Invoice Amount'
        align='right'
      />
    ),
    cell: ({ row }) => {
      const amount = row.getValue('total_amount');
      const formatted = !isNaN(Number(amount))
        ? new Intl.NumberFormat('id-ID').format(Number(amount))
        : '-';
      return <div className='text-right tabular-nums'>{formatted}</div>;
    },
    meta: {
      align: 'right',
    },
  },
  {
    accessorKey: 'paidStatus',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Paid Status'
        className='text-black dark:text-slate-300'
        align='right'
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
    enableSorting: false,
  },
];

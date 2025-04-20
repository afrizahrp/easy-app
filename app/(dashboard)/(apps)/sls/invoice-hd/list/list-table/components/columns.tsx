'use client';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'; // Impor Tooltip
import { getStatusColor } from '@/utils/statusUils';

import Link from 'next/link';

export type SalesInvoiceHdColumns = {
  po_id: string;
  invoiceDate: Date;
  invoice_id: string;
  customerName: string;
  salesPersonName: string;
  invoiceTypeName: string;
  invoicePoTypeName: string;
  paidStatus: string;
  total_amount: number;
};

export const columns: ColumnDef<SalesInvoiceHdColumns>[] = [
  // {
  //   accessorKey: 'po_id',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Po Id.' />
  //   ),
  //   cell: ({ row }) => (
  //     <Link
  //       href={`/inventory/categories/${row.getValue('po_id')}`}
  //       className='text-primary-600 dark:text-primary-400'
  //     >
  //       {row.getValue('po_id')}
  //     </Link>
  //   ),
  //   enableHiding: false,
  //   enableSorting: true, // pastikan ini ada
  // },

  {
    accessorKey: 'invoice_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Invoice No' />
    ),
    cell: ({ row }) => (
      <Link
        // href={`/sls/invoice-dt/${row.getValue('invoice_id')}`}
        href={`/sls/invoice-dt/${encodeURIComponent(row.getValue('invoice_id'))}`}
        className='text-primary-600 dark:text-primary-400'
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
      const formattedDate =
        rawDate instanceof Date
          ? format(rawDate, 'dd/MM/yyyy')
          : format(new Date(rawDate as string | number), 'dd/MM/yyyy');

      return formattedDate;
    },
    enableSorting: true,
    enableHiding: false,
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
    accessorKey: 'total_amount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Total Amount'
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
      align: 'right', // optional, kalau kamu pakai sistem align via meta
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
  },
  // {
  //   accessorKey: 'salesPersonName',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Sales Person' />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex space-x-1'>
  //         <span className={cn('max-w-[450px] truncate font-sm')}>
  //           {row.getValue('salesPersonName')}
  //         </span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value: string) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   accessorKey: 'invoiceType',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Type' />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex space-x-1'>
  //         <span className={cn('max-w-[450px] truncate font-sm')}>
  //           {row.getValue('invoiceType')}
  //         </span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
];

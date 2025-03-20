'use client';
import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { CellAction } from './cell-action';

export type ProductColumn = {
  id: string;
  name: string | null;
  category: string | null;
  category_id: string;
  iStatus: boolean;
  status: string | null;
  qty: number | null;
  uom: string | null;
  sellingPrice: number | null;
  images: string[];
};

export function getStatusColor(status: string) {
  if (status.toLowerCase() === 'active') {
    return 'bg-green-600';
  } else {
    return 'bg-gray-400';
  }
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    id: 'actions',
    header: () => (
      <div className='flex items-center justify-center space-x-2'>
        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Quick Edit
        </span>
        {/* <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-4 h-4 text-gray-500 dark:text-gray-400'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M16.862 4.487l2.651 2.651m-6.906 1.5L19.5 2.25l-2.652-2.652m0 0L2.25 16.25v4.5h4.5L21.75 6.487z'
          />
        </svg> */}
      </div>
    ),
    cell: ({ row }) => <CellAction data={row.original} />,
  },

  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Id'
        className='text-black dark:text-slate-300'
      />
    ),
    cell: ({ row }) => (
      <Link
        href={`/inventory/products/${row.getValue('id')}`}
        className='text-primary-600 dark:text-slate-200'
      >
        {row.getValue('id')}
      </Link>
    ),
    enableHiding: false,
    enableSorting: true,
  },

  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Category'
        className='text-black dark:text-slate-300'
      />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <span className='max-w-[150px] dark:text-slate-300 truncate font-sm'>
            {row.getValue('category')}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Name'
        className='text-black dark:text-slate-300'
      />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <span
            className={cn('max-w-[450px] dark:text-slate-300 truncate font-sm')}
          >
            {row.getValue('name')}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'qty',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Qty'
        className='text-black dark:text-slate-300'
      />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <span
            className={cn('max-w-[450px] dark:text-slate-300 truncate font-sm')}
          >
            {row.getValue('qty')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'uom',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='UOM'
        className='text-black dark:text-slate-300'
      />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <span className='max-w-[150px] dark:text-slate-300 truncate font-sm'>
            {row.getValue('uom')}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // {
  //   accessorKey: 'sellingPrice',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title='Selling Price'
  //       className='text-black dark:text-slate-300 text-right' // Align header to the right
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     const sellingPrice = row.getValue('sellingPrice') as number;
  //     const formattedPrice = new Intl.NumberFormat('id-ID', {
  //       style: 'decimal',
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }).format(sellingPrice);
  //     return (
  //       <div
  //         className='text-right'
  //         style={{ minWidth: '100px', maxWidth: '150px' }}
  //       >
  //         {' '}
  //         {/* Adjust the width as needed */}
  //         <span className='max-w-[150px] dark:text-slate-300 truncate font-sm'>
  //           {formattedPrice}
  //         </span>
  //       </div>
  //     );
  //   },
  // },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Status'
        className='text-black dark:text-slate-300'
      />
    ),
    cell: ({ row }) => {
      let value: string = row.getValue('status');
      const color = getStatusColor(value);
      return (
        <div className='w-[80px] text-left'>
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
];

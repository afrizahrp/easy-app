'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

export type MaterialColumn = {
  id: string;
  name: string | null;
  category: string | null;
  subcategory: string | null;
  brand: string | null;
  status: string | null;
  uom: string | null;
  remarks: string | null;
};

export function getStatusColor(status: string) {
  if (status.toLowerCase() === 'active') {
    return 'bg-green-600';
  } else {
    return 'bg-gray-400';
  }
}

export const columns: ColumnDef<MaterialColumn>[] = [
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
        href={`/inventory/materials/${row.getValue('id')}`}
        className='text-primary-600 dark:text-slate-200'
      >
        {row.getValue('id')}
      </Link>
    ),
    enableHiding: false,
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: 'remarks',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Remarks'
        className='text-black dark:text-slate-300'
      />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <span className='max-w-[150px] truncate dark:text-slate-300 font-sm'>
            {row.getValue('remarks')}
          </span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: 'subcategory',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title='Subcategory'
  //       className='text-black dark:text-slate-300'
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex space-x-1'>
  //         <span className='max-w-[150px] dark:text-slate-300 truncate font-sm'>
  //           {row.getValue('subcategory')}
  //         </span>
  //       </div>
  //     );
  //   },
  // },

  // {
  //   accessorKey: 'brand',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title='Brand'
  //       className='text-black dark:text-slate-300'
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex space-x-1'>
  //         <span className='max-w-[150px] dark:text-slate-300 truncate font-sm'>
  //           {row.getValue('brand')}
  //         </span>
  //       </div>
  //     );
  //   },
  // },
];

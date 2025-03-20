'use client';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import NextImage from 'next/image';
import Link from 'next/link';
import { getStatusColor, getDisplayStatus } from '@/utils/statusUils';
import { EyeOff, Eye } from 'lucide-react';

export type CategoryColumns = {
  id: string;
  name: string;
  categoryType: string;
  iStatus: string;
  remarks?: string;
  imageURL: string;
  slug: string | null;
  iShowedStatus: string;
};

export const columns: ColumnDef<CategoryColumns>[] = [
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },

  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Id' />
    ),
    cell: ({ row }) => (
      <Link
        href={`/inventory/categories/${row.getValue('id')}`}
        className='text-primary-600 dark:text-primary-400'
      >
        {row.getValue('id')}
      </Link>
    ),
    enableHiding: false,
  },

  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <span className={cn('max-w-[450px] truncate font-sm')}>
            {row.getValue('name')}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'categoryType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <span className={cn('max-w-[450px] truncate font-sm')}>
            {row.getValue('categoryType')}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'iStatus',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Status'
        className='text-black dark:text-slate-300'
      />
    ),
    cell: ({ row }) => {
      let value: string = row.getValue('iStatus');
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
    accessorKey: 'imageURL',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Images' />
    ),
    cell: ({ row }) => {
      const imageURL = row.getValue('imageURL') as string;

      return (
        <div className='flex space-x-1'>
          {imageURL && (
            <NextImage
              src={imageURL}
              width={60}
              height={80}
              alt='Image'
              className='max-w-[80px] object-cover'
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'iShowedStatus',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Visibility'
        className='text-black dark:text-slate-300'
      />
    ),
    cell: ({ row }) => {
      let value: string = row.getValue('iShowedStatus') as string;
      const displayStatus = getDisplayStatus(value);
      const isDisplayed = displayStatus === 'Shown';
      return (
        <div className='w-[40px]'>
          {isDisplayed ? (
            <Eye className='mr-2 text-green-500' />
          ) : (
            <EyeOff className='mr-2 text-gray-500' />
          )}
        </div>
      );
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: 'remarks',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Remarks' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <span className={cn('max-w-[350px] truncate font-sm')}>
            {row.getValue('remarks')}
          </span>
        </div>
      );
    },
  },
];

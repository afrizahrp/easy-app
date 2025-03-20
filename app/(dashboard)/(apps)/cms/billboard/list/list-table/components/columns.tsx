'use client';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { getDisplayStatus } from '@/utils/statusUils';
import { EyeOff, Eye } from 'lucide-react';

import NextImage from 'next/image';
import { Video } from 'cloudinary-react';

export type BillboardColumn = {
  id: number;
  section: string;
  description: string;
  iStatus: string;
  iShowedStatus: string;
  remarks: string;
  isImage: boolean;
  contentURL: string;
  // contentPrimary: string[];
};

export const columns: ColumnDef<BillboardColumn>[] = [
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
      <div className='w-[10px] dark:text-slate-300'>
        <Link
          href={routes.cms.editBillboardCms(row.getValue('id'))}
          className='text-primary-600 dark:text-slate-200'
        >
          {row.getValue('id')}
        </Link>
      </div>
    ),
    enableHiding: false,
    enableSorting: true,
  },

  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Title'
        className='text-black dark:text-slate-300'
      />
    ),
    cell: ({ row }) => (
      <div className='w-[200px] dark:text-slate-300'>
        <Link
          href={routes.cms.editBillboardCms(row.getValue('id'))}
          className='text-primary-600 dark:text-slate-200'
        >
          {row.getValue('description')}
        </Link>{' '}
      </div>
    ),
    enableHiding: false,
  },

  {
    accessorKey: 'isImage',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Content Type'
        className='text-black dark:text-slate-300'
      />
    ),
    cell: ({ row }) => {
      const isImage = row.getValue('isImage');
      let displayText = 'No Content'; // Default text
      if (isImage === true) {
        displayText = 'Image';
      } else if (isImage === false) {
        displayText = 'Video';
      }
      return <span>{displayText}</span>;
    },
    enableHiding: true,
  },

  {
    accessorKey: 'contentURL',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Content' />
    ),
    cell: ({ row }) => {
      const isImage = row.getValue('isImage'); //true = image , false video
      const contentURL = row.getValue('contentURL');

      return (
        <div className='flex space-x-1 rounded-md'>
          {contentURL === '' ? (
            <span>No content</span>
          ) : isImage ? (
            <NextImage
              src={row.getValue('contentURL')}
              width={170}
              height={170}
              alt='Image'
              className='max-w-[180px] rounded' // Added rounded corners here
            />
          ) : (
            <Video
              cloudName='biwebapp-live'
              publicId={row.getValue('contentURL')}
              width='170px'
              height='170px'
              controls
              loop
              className='max-w-[180px] rounded' // And here
            />
          )}
        </div>
      );
    },
    enableSorting: false,
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
];

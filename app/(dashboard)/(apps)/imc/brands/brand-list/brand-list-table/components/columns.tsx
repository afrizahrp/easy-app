'use client'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import Link from 'next/link'

export type BrandColumns = {
  id: string
  name: string | null
  status: string | null
  remarks: string | null
}

export function getStatusColor(status: string) {
  if (status.toLowerCase() === 'active') {
    return 'bg-green-600'
  } else {
    return 'bg-gray-400'
  }
}
export const columns: ColumnDef<BrandColumns>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Id' />,
    cell: ({ row }) => (
      <Link href={`/inventory/brands/${row.getValue('id')}`} className='text-primary-600 dark:text-primary-400'>
        {row.getValue('id')}
      </Link>
    ),
    enableHiding: false
  },

  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <span className={cn('max-w-[450px] truncate font-sm')}>{row.getValue('name')}</span>
        </div>
      )
    }
  },

  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      let value: string = row.getValue('status')
      const color = getStatusColor(value)
      return (
        <div className='flex items-center'>
          <span className={cn('inline-block h-3 w-3 rounded-full mr-2', color)}></span>
          {value}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },

  {
    accessorKey: 'remarks',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Remarks' />,
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <span className={cn('max-w-[350px] truncate font-sm')}>{row.getValue('remarks')}</span>
        </div>
      )
    }
  }
]

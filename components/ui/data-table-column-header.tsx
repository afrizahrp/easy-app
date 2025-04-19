'use client';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  align?: 'left' | 'center' | 'right';
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  align = 'left'
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div
      className={cn(
        'flex items-center space-x-2',
        align === 'right' && 'justify-end',
        align === 'center' && 'justify-center',
        align === 'left' && 'justify-start',
        className
      )}
    >
      <span>{title}</span>
      {column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon className='ml-2 h-4 w-4' />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon className='ml-2 h-4 w-4' />
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='h-8'>
            <CaretSortIcon className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            Desc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.clearSorting()}>
            Clear Sort
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

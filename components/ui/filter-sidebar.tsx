'use client';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { Table } from '@tanstack/react-table';
// import { DataTableToolbar } from "./data-table-toolbar";
import { Separator } from '@/components/ui/separator';

// import { ProductsFilterSidebar,MaterialFilterSidebar } from "../FilterSidebarButton";

import { FilterSidebarButton } from '../FilterSidebarButton';

interface FilterSidebarProps<TData> {
  table: Table<TData>;
  pageName?: string;
  open: boolean;
  onClose: () => void;
}

export function FilterSidebar<TData>({
  table,
  pageName,
  open,
  onClose,
}: FilterSidebarProps<TData>) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className='pt-5'>
        <SheetTitle>Filter Data</SheetTitle>
        <SheetHeader className='flex-row items-center justify-between mb-4'>
          <span className='text-sm text-default-400 mt-0'>
            To get specific data you needs
          </span>
        </SheetHeader>

        <Separator />
        <form className=' h-full flex flex-col justify-between'>
          <div className='space-y-4 w-full'>
            {/* <DataTableToolbar table={table} /> */}
            {/* <ProductsFilterSidebar table={table} /> */}
            <FilterSidebarButton table={table} pageName={pageName} />
          </div>
          <SheetFooter className='pb-12'>
            <SheetClose asChild>
              <Button
                className='w-full'
                type='button'
                color='primary'
                variant='outline'
              >
                Back
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default FilterSidebar;

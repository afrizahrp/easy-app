'use client';
import { useEffect } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import useCategoryStatusOptions from '@/queryHooks/useCategoryStatusOptions';
import useCategoryTypeOptions from '@/queryHooks/useCategoryTypeOptions';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { useCategoryFilterStore } from '@/store'; // ✅ Gunakan Zustand Store

interface CategoryFilterSidebarProps<TData> {
  table: Table<TData>;
}

export function CategoryFilterSidebar<TData>({
  table,
}: CategoryFilterSidebarProps<TData>) {
  const { status, setStatus, categoryType, setCategoryType } =
    useCategoryFilterStore();

  useEffect(() => {
    table
      .getColumn('iStatus')
      ?.setFilterValue(status.length ? status : undefined);
    table
      .getColumn('categoryType')
      ?.setFilterValue(categoryType.length ? categoryType : undefined);
  }, [status, categoryType, table]);

  const { options: statusOptionList, isLoading: isStatusLoading } =
    useCategoryStatusOptions();
  const { typeOptions: typeOptionList, isLoading: isTypeLoading } =
    useCategoryTypeOptions();

  return (
    <div className='flex items-center justify-end py-2'>
      <div className='flex flex-col items-center space-y-2 w-full'>
        <div className='w-full py-3'>
          {table.getColumn('iStatus') && (
            <DataTableFacetedFilter
              column={table.getColumn('iStatus')}
              title='Status'
              options={statusOptionList}
              isLoading={isStatusLoading}
              selectedValues={new Set(status)}
              onSelect={(value) => {
                const updatedValues = new Set(status);
                value
                  ? updatedValues.has(value)
                    ? updatedValues.delete(value)
                    : updatedValues.add(value)
                  : updatedValues.clear();
                setStatus(Array.from(updatedValues));
                table
                  .getColumn('iStatus')
                  ?.setFilterValue(
                    updatedValues.size ? Array.from(updatedValues) : undefined
                  );
              }}
            />
          )}
        </div>
        <div className='w-full py-3'>
          {table.getColumn('categoryType') && (
            <DataTableFacetedFilter
              column={table.getColumn('categoryType')}
              title='Type'
              options={typeOptionList}
              isLoading={isTypeLoading}
              selectedValues={new Set(categoryType)}
              onSelect={(value) => {
                const updatedValues = new Set(categoryType);
                value
                  ? updatedValues.has(value)
                    ? updatedValues.delete(value)
                    : updatedValues.add(value)
                  : updatedValues.clear();
                setCategoryType(Array.from(updatedValues));
                table
                  .getColumn('categoryType')
                  ?.setFilterValue(
                    updatedValues.size ? Array.from(updatedValues) : undefined
                  );
              }}
            />
          )}
        </div>
        {table.getState().columnFilters.length > 0 && (
          <Button
            variant='outline'
            onClick={() => {
              table.resetColumnFilters();
              setStatus([]);
              setCategoryType([]);
            }}
            className='h-10 px-2 lg:px-3 w-full mb-5'
          >
            <Cross2Icon className='ml-2 h-4 w-4' />
            Reset Filter
          </Button>
        )}
      </div>
    </div>
  );
}

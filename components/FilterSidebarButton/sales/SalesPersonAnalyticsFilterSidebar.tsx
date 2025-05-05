'use client';
import { PeriodFilter } from '@/components/period-filter';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import useSalesInvoiceHdSalesPersonOptions from '@/queryHooks/sales/useSalesInvoiceHdSalesPersonOptions';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';

export function SalesPersonAnalyticsFilterSidebar() {
  const { salesPersonName, setSalesPersonName } =
    useSalesInvoiceHdFilterStore();
  const { options: salesPersonOptionList, isLoading: isSalesPersonLoading } =
    useSalesInvoiceHdSalesPersonOptions();

  const handleReset = () => {
    setSalesPersonName([]);
  };

  return (
    <div className='flex flex-col space-y-4 w-full py-2'>
      <PeriodFilter />
      <div className='w-full py-3'>
        <DataTableFacetedFilter
          column={undefined}
          title='Sales Person'
          options={salesPersonOptionList}
          isLoading={isSalesPersonLoading}
          selectedValues={new Set(salesPersonName)}
          onSelect={(value) => {
            const updatedValues = new Set(salesPersonName);
            value
              ? updatedValues.has(value)
                ? updatedValues.delete(value)
                : updatedValues.add(value)
              : updatedValues.clear();
            setSalesPersonName(Array.from(updatedValues));
          }}
        />
      </div>
      {salesPersonName.length > 0 && (
        <Button
          variant='outline'
          onClick={handleReset}
          className='h-10 px-2 w-full'
        >
          <Cross2Icon className='ml-2 h-4 w-4' />
          Reset Filter
        </Button>
      )}
    </div>
  );
}

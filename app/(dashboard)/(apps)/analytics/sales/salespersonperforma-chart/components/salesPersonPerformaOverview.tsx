'use client';
import React, { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { useSalesInvoiceHdFilterStore } from '@/store';
import MonthlySalesPersonInvoiceChart from './monthlySalesPersonInvoiceChart';
import MonthlySalesPersonInvoiceFilteredChart from './monthlySalesPersonInvoiceFilteredChart';
import { FloatingFilterButton } from '@/components/ui/floating-filter-button';
import { SalesPersonInvoiceFilterSidebar } from '@/components/FilterSidebarButton/sales/salesPersonlnvoiceFilterSidebar';

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
  color?: string;
}

interface SalesPersonPerformaOverviewProps {
  showFloatingButton?: boolean;
  showList?: boolean;
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (selection: SalesPersonSelection | null) => void;
}

const SalesPersonPerformaOverview: React.FC<
  SalesPersonPerformaOverviewProps
> = ({
  showFloatingButton,
  showList = true,
  isFullWidth = true,
  onModeChange,
  onSalesPersonSelect,
}) => {
  const { salesPersonInvoiceFilters, setSalesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore((state) => ({
      salesPersonInvoiceFilters: state.salesPersonInvoiceFilters,
      setSalesPersonInvoiceFilters: state.setSalesPersonInvoiceFilters,
    }));

  const salesPersonName = salesPersonInvoiceFilters.salesPersonName;

  const validSalesPersonNames = Array.isArray(
    salesPersonInvoiceFilters.salesPersonName
  )
    ? salesPersonInvoiceFilters.salesPersonName.filter(
        (name) => typeof name === 'string' && name.trim()
      )
    : salesPersonInvoiceFilters.salesPersonName &&
        typeof salesPersonInvoiceFilters.salesPersonName === 'string' &&
        salesPersonInvoiceFilters.salesPersonName
      ? [salesPersonInvoiceFilters.salesPersonName]
      : [];

  const handleSalesPersonSelect = (selection: SalesPersonSelection | null) => {
    if (selection) {
      if (!salesPersonName.includes(selection.salesPersonName)) {
        setSalesPersonInvoiceFilters({
          ...salesPersonInvoiceFilters,
          salesPersonName: [selection.salesPersonName],
        });
      }
      onSalesPersonSelect?.(selection);
    } else {
      if (salesPersonName.length > 0) {
        setSalesPersonInvoiceFilters({
          ...salesPersonInvoiceFilters,
          salesPersonName: [],
        });
      }
      onSalesPersonSelect?.(null);
    }
  };

  const dummyTable = {
    getState: () => ({
      columnFilters: [],
      sorting: [],
      pagination: { pageIndex: 0, pageSize: 10 },
      globalFilter: '',
      rowSelection: {},
    }),
    getColumn: () => undefined,
    getFilteredRowModel: () => ({ rows: [] }),
    resetColumnFilters: () => {},
    setColumnFilters: () => {},
  } as unknown as Table<any>;

  return (
    <div
      className={`flex flex-col w-full p-2 gap-4 ${showList ? 'h-fit' : 'h-fit min-h-0'}`}
    >
      {showFloatingButton && (
        <div className='flex-none w-full md:w-1/2'>
          <FloatingFilterButton
            modalPosition='above'
            title='Filter Data'
            description='Filter sales invoice by salesperson and paid status.'
          >
            <SalesPersonInvoiceFilterSidebar
              table={dummyTable}
              context='salesPersonInvoice'
            />
          </FloatingFilterButton>
        </div>
      )}
      <div className='w-full h-fit min-h-0'>
        {validSalesPersonNames.length > 0 ? (
          <MonthlySalesPersonInvoiceFilteredChart
            key={`filtered-${validSalesPersonNames.join('-')}`}
            isFullWidth={isFullWidth}
            onModeChange={onModeChange}
            onSalesPersonSelect={handleSalesPersonSelect}
            height={300}
          />
        ) : (
          <MonthlySalesPersonInvoiceChart
            isFullWidth={isFullWidth}
            height={showList ? 400 : 300}
            isCompact={!showList}
            onModeChange={onModeChange}
            onSalesPersonSelect={handleSalesPersonSelect}
          />
        )}
      </div>
    </div>
  );
};

export default SalesPersonPerformaOverview;

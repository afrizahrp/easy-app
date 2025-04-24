'use client';
import { DataTable } from '@/components/ui/data-table';
import { SortingState } from '@tanstack/react-table';

import { BillboardColumn, columns } from './columns';

import { routes } from '@/config/routes';
// import { Heading } from '@/components/ui/heading';
// import { Separator } from '@/components/ui/separator';
// import { ApiList } from '@/components/ui/api-list';
// import { useSession } from 'next-auth/react';

interface BillboardsClientProps {
  data: BillboardColumn[];
  currentPage: number;
  totalPages: number;
  totalRecords: number | undefined;
  onPageChange: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  sorting: SortingState;

  setSorting: (
    sorting: SortingState | ((old: SortingState) => SortingState)
  ) => void;
}

const columnLabels = {
  poType: 'Po Type',
  po_id: 'Po Id',
  customerName: 'Customer',
  salesPersonName: 'Sales Person',
  invoiceNo: 'Invoice Id',
  invoiceDate: 'Invoice Date',
  total_amount: 'Total Amount',
  paidStatus: 'Paid Status',
};

const searchOptionItem = {
  customerName: 'Customer',
  po_id: 'Po No',
  invoice_id: 'Invoice No',
};

export const BillboardListTable: React.FC<BillboardsClientProps> = ({
  data,
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  limit,
  setLimit,
  sorting,
  setSorting,
}) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        href={routes.cms.newBillboard}
        hrefText='New Billboard'
        pageName='billboard-web'
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        limit={limit}
        setLimit={setLimit}
        sorting={sorting} // Pass sorting
        setSorting={setSorting} // Pass setSorting
        columnLabels={columnLabels} // Pass columnLabels
        searchOptionItem={searchOptionItem} // Pass searchOptionItem
      />
    </div>
  );
};

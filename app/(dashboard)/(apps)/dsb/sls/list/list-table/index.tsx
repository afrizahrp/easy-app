'use client';
import { DataTable } from '@/components/ui/data-table';
import { SalesInvoiceHdColumns, columns } from './components/columns';
import { SortingState } from '@tanstack/react-table';

interface SalesInvoiceHdProps {
  data: SalesInvoiceHdColumns[];
  currentPage: number;
  totalPages: number;
  totalRecords: number | undefined;
  onPageChange: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  sorting: SortingState; // Tambah props

  setSorting: (
    sorting: SortingState | ((old: SortingState) => SortingState)
  ) => void; // Perbaiki tipe
}

export const InvoiceListTable: React.FC<SalesInvoiceHdProps> = ({
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
        href='#' //{routes.inventory.newCategory}
        hrefText='none'
        searchTerm='customerName'
        placeholder='Type here to search invoice by id or customer name...'
        pageName='salesInvoice'
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        limit={limit}
        setLimit={setLimit}
        sorting={sorting} // Pass sorting
        setSorting={setSorting} // Pass setSorting
      />
    </div>
  );
};

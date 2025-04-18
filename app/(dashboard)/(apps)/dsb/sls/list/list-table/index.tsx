'use client';
import { DataTable } from '@/components/ui/data-table';
import { SalesInvoiceHdColumns, columns } from './components/columns';

interface SalesInvoiceHdProps {
  data: SalesInvoiceHdColumns[];
  currentPage: number;
  totalPages: number;
  totalRecords: number | undefined;
  onPageChange: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export const InvoiceListTable: React.FC<SalesInvoiceHdProps> = ({
  data,
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  limit,
  setLimit,
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
      />
    </div>
  );
};

'use client';
import { DataTable } from '@/components/ui/data-table';
import { InvoiceHdColumns, columns } from './components/columns';
import { routes } from '@/config/routes';

interface CategoriesProps {
  data: InvoiceHdColumns[];
  currentPage: number;
  totalPages: number;
  totalRecords: number | undefined;
  onPageChange: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export const InvoiceListTable: React.FC<CategoriesProps> = ({
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
        pageName='invoice'
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

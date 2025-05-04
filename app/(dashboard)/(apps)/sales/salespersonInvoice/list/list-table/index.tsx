'use client';
import { DataTable } from '@/components/ui/data-table';
import { SalesPersonInvoiceListColumns, columns } from './components/columns';
import { SortingState } from '@tanstack/react-table';
import { SearchContext } from '@/constants/searchContexts';

interface SalesPersonInvoiceListTableProps {
  data: SalesPersonInvoiceListColumns[];
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
  context: SearchContext;
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
  po_id: 'Po Id',
  invoice_id: 'Invoice No',
};

export const InvoiceListTable: React.FC<SalesPersonInvoiceListTableProps> = ({
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
        placeholder='Type here to search invoice by id or customer name...'
        pageName='salespersoninvoicelist'
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
        context='salesPersonInvoice' // Pass context
      />
    </div>
  );
};

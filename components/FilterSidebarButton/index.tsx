import { Table } from '@tanstack/react-table';
import { ProductsFilterSidebar } from './productsFilterSidebar';
import { ProductsFilterSidebarWeb } from './productsFilterSidebar-web';
import { MaterialFilterSidebar } from './materialFilterSidebar';
import { CategoryFilterSidebar } from './categoryFilterSidebar';
import { CategoryFilterSidebarWeb } from './categoryFilterSidebar-web';
import { SalesInvoiceFilterSidebar } from './sales/saleslnvoiceFilterSidebar';
import { SalesPersonInvoiceFilterSidebar } from './sales/salesPersonlnvoiceFilterSidebar';

interface FilterSidebarButtonProps<TData> {
  table: Table<TData>;
  pageName?: string;
}
export function FilterSidebarButton<TData>({
  table,
  pageName,
}: FilterSidebarButtonProps<TData>) {
  switch (pageName) {
    case 'product':
      return <ProductsFilterSidebar table={table} />;
    case 'product-web':
      return <ProductsFilterSidebarWeb table={table} />;
    case 'material':
      return <MaterialFilterSidebar table={table} />;
    case 'category':
      return <CategoryFilterSidebar table={table} />;
    case 'salesinvoice':
      return <SalesInvoiceFilterSidebar context='salesInvoice' table={table} />;
    case 'salespersoninvoicelist':
      return <SalesPersonInvoiceFilterSidebar table={table} />;
    // case 'category-web':
    //   return <CategoryFilterSidebarWeb table={table} />;

    default:
      return <div>No sidebar available for this page</div>;
  }
}

export default FilterSidebarButton;

import { Table } from '@tanstack/react-table';
import { ProductsFilterSidebar } from './productsFilterSidebar';
import { ProductsFilterSidebarWeb } from './productsFilterSidebar-web';
import { MaterialFilterSidebar } from './materialFilterSidebar';
import { CategoryFilterSidebar } from './categoryFilterSidebar';
import { CategoryFilterSidebarWeb } from './categoryFilterSidebar-web';
import { SubCategoryFilterSidebar } from './subCategoryFilterSidebar';

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
    case 'category-web':
      return <CategoryFilterSidebarWeb table={table} />;
    case 'subcategory':
      return <SubCategoryFilterSidebar table={table} />;
    default:
      return <div>No sidebar available for this page</div>;
  }
}

export default FilterSidebarButton;

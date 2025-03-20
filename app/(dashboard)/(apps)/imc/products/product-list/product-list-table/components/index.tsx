import { DataTable } from '@/components/ui/data-table';
import { ProductColumn, columns } from './columns';
import { routes } from '@/config/routes';

interface ProductsClientProps {
  data: ProductColumn[];
}

export const ProductListTable: React.FC<ProductsClientProps> = ({ data }) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        href={routes.inventory.newProduct}
        hrefText='New Product'
        pageName='product'
      />
    </div>
  );
};

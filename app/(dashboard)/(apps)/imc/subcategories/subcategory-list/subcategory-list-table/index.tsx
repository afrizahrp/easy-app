'use client';
import { DataTable } from '@/components/ui/data-table';
import { SubCategoryColumns, columns } from './components/columns';

import { routes } from '@/config/routes';

interface SubCategoriesProps {
  data: SubCategoryColumns[];
}

export const SubCategoryListTable: React.FC<SubCategoriesProps> = ({
  data,
}) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        href={routes.inventory.newSubCategory}
        hrefText='New Subcategory'
        pageName='subcategory'
      />
    </div>
  );
};

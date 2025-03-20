// 'use client'
import { DataTable } from "@/components/ui/data-table";
import { MaterialColumn, columns } from "./columns";
import { routes } from "@/config/routes";

interface MaterialClientProps {
  data: MaterialColumn[];
}

export const MaterialListTable: React.FC<MaterialClientProps> = ({ data }) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        href={routes.inventory.newMaterial}
        hrefText="New Material"
        pageName="material"
      />
    </div>
  );
};

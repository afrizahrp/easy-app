'use client'
import { DataTable } from '@/components/ui/data-table'
import { BrandColumns, columns } from './components/columns'

import { routes } from '@/config/routes'

interface BrandProps {
  data: BrandColumns[]
}

export const BrandListTable: React.FC<BrandProps> = ({ data }) => {
  return (
    <div>
      <DataTable columns={columns} data={data} href={routes.inventory.newBrand} hrefText='New Brand' pageName='brand' />
    </div>
  )
}

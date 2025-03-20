import { prisma } from '@/lib/client'
import { BrandListTable } from './brand-list-table'
import { BrandColumns } from './brand-list-table/components/columns'
import { Card, CardContent } from '@/components/ui/card'
import PageHeader from '@/components/page-header'
import { routes } from '@/config/routes'

const pageHeader = {
  title: 'Brand List',
  breadcrumb: [
    {
      name: 'Dashboard',
      href: routes.inventory.dashboard
    },

    {
      name: 'List'
    }
  ]
}

const BrandsPage = async () => {
  const brands = await prisma.brands.findMany({
    include: {
      status: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  const formattedBrands: BrandColumns[] =
    brands?.map(item => ({
      id: item.id,
      name: item.name,
      status: item?.status?.name,
      remarks: item?.remarks
    })) ?? []

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <div>
        <Card className='mt-6'>
          <CardContent className='p-10'>
            <BrandListTable data={formattedBrands} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default BrandsPage

import { prisma } from '@/lib/client'
import PageHeader from '@/components/page-header'
import { routes } from '@/config/routes'
import { Card, CardContent } from '@/components/ui/card'
import { BrandForm } from './components/brand-form'

const BrandPage = async ({
  params
}: {
  params: {
    id: string
    // type: string;
  }
}) => {
  const brand = await prisma.brands.findUnique({
    where: {
      id: params.id
    }
  })

  const pageHeader = {
    title: brand ? 'Edit brand' : 'New brand',
    breadcrumb: [
      {
        name: 'Dashboard',
        href: routes.inventory.dashboard
      },
      {
        name: 'List',
        href: routes.inventory.subcategories
      },
      {
        name: brand ? 'Edit brand' : 'New brand'
      }
    ]
  }

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <Card className='py-6'>
        <CardContent>
          <BrandForm initialData={brand || undefined} />
        </CardContent>
      </Card>
    </>
  )
}

export default BrandPage

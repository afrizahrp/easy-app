import { prisma } from '@/lib/client'
import PageHeader from '@/components/page-header'
import { routes } from '@/config/routes'
import { Card, CardContent } from '@/components/ui/card'

import { ProductForm } from './components/product-form'
const ProductPage = async ({
  params
}: {
  params: {
    id: string
    category_id: string
    subCategory_id: string
    brand_id: string
    uom_id: string
  }
}) => {
  const product = await prisma.products.findUnique({
    where: {
      id: params.id
    },
    include: {
      images: true
    }
  })

  // const productImages = await prisma.productImages.findMany({
  //   where: {
  //     product_id: params.id,
  //   },
  // });

  // const productSpec = await prisma.productSpecs.findUnique({
  //   where: {
  //     id: params.id,
  //   },
  // });

  const categories = await prisma.categories.findMany({
    where: {
      id: params.category_id,
      type: '1',
      iStatus: true
    }
  })

  const subCategories = await prisma.subCategories.findMany({
    where: {
      category_id: params.category_id,
      id: params.subCategory_id
    }
  })

  const brands = await prisma.brands.findMany({
    where: {
      id: params.brand_id
    }
  })

  const uoms = await prisma.uoms.findMany({
    where: {
      id: params.uom_id
    }
  })

  const productImages = await prisma.productImages.findMany({
    where: {
      product_id: params.id
    }
  })

  const pageHeader = {
    title: product ? 'Edit Product' : 'New Product',
    breadcrumb: [
      {
        name: 'Dashboard',
        href: routes.inventory.dashboard
      },
      {
        name: 'List',
        href: routes.inventory.products
      },
      {
        name: product ? 'Edit Product' : 'New Product'
      }
    ]
  }

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <Card className='py-6'>
        <CardContent>
          <ProductForm
            initialProductData={product}
            categories={categories}
            subCategories={subCategories}
            brands={brands}
            uoms={uoms}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default ProductPage

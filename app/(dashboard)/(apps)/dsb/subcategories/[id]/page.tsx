import { prisma } from '@/lib/client';
import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { Card, CardContent } from '@/components/ui/card';
import { SubCategoryForm } from './components/subcategory-form';

const SubCategoryPage = async ({
  params,
}: {
  params: {
    id: string;
    // type: string;
  };
}) => {
  const subCategory = await prisma.subCategories.findUnique({
    where: {
      id: params.id,
    },
    include: {
      category: true,
    },
  });

  const pageHeader = {
    title: subCategory ? 'Edit subCategory' : 'New subCategory',
    breadcrumb: [
      {
        name: 'Dashboard',
        href: routes.inventory.dashboard,
      },
      {
        name: 'List',
        href: routes.inventory.subcategories,
      },
      {
        name: subCategory ? 'Edit subCategory' : 'New subCategory',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <Card className='py-6'>
        <CardContent>
          <SubCategoryForm initialData={subCategory || undefined} />
        </CardContent>
      </Card>
    </>
  );
};

export default SubCategoryPage;

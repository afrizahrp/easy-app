import { prisma } from '@/lib/client';
import { MaterialListTable } from './material-list-table/components';
import { MaterialColumn } from './material-list-table/components/columns';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';

const pageHeader = {
  title: 'Raw Material List',
  breadcrumb: [
    {
      name: 'Dashboard',
      href: routes.inventory.dashboard,
    },
    {
      name: 'List',
    },
  ],
};
const MaterialListPage = async () => {
  const materials = await prisma.products.findMany({
    where: {
      isMaterial: true,
    },
    include: {
      brand: true,
      category: true,
      subCategory: true,
      status: true,
      uom: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  const formattedMaterial: MaterialColumn[] =
    materials?.map((item) => ({
      id: item.id,
      name: item.name ?? '',
      category: item.category?.name || '', // Add type assertion to ensure category is always a string
      subcategory: item.subCategory?.name || '',
      brand: item.brand?.name || '',
      status: item.status?.name,
      uom: item.uom?.name || '',
      remarks: item.remarks,
    })) ?? [];

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <div>
        <Card className='mt-6'>
          <CardContent className='p-10'>
            <MaterialListTable data={formattedMaterial} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MaterialListPage;

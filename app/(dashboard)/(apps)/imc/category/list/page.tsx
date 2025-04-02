'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryListTable } from './list-table';
import LayoutLoader from '@/components/layout-loader';
import { routes } from '@/config/routes';
import PageHeader from '@/components/page-header';
import useCategory from '@/queryHooks/useCategory';
import { CategoryColumns } from './list-table/components/columns';
import { usePageStore } from '@/store';

const CategoryListPage = () => {
  const { currentPage } = usePageStore();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [categoryType, setCategoryType] = useState<string | null>(null);

  const { data, total, isFetching, error } = useCategory({
    page: currentPage,
    limit,
  });

  if (isFetching && !data) {
    return (
      <div>
        <LayoutLoader />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching category: {error.message}</div>;
  }

  const formattedCategory: CategoryColumns[] =
    data?.map((item) => ({
      id: item.id,
      name: item.name,
      categoryType: item.categoryType,
      slug: item.slug,
      iStatus: item.iStatus,
      imageURL: item.imageURL,
      remarks: item.remarks,
      iShowedStatus: item.iShowedStatus,
    })) ?? [];

  return (
    <>
      <PageHeader
        title='Category List'
        breadcrumb={[
          { name: 'Dashboard', href: routes.inventory.dashboard },
          { name: 'List' },
        ]}
      />
      <div>
        <Card className='mt-6'>
          <CardContent className='p-10'>
            <CategoryListTable
              data={formattedCategory}
              currentPage={page}
              totalPages={Math.ceil((total ?? 0) / limit)}
              totalRecords={total}
              onPageChange={setPage}
              limit={limit}
              setLimit={setLimit}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CategoryListPage;

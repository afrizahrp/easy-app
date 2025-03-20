'use client';
import React, { useState } from 'react';
import { BillboardListTable } from './list-table/components';
import { BillboardColumn } from './list-table/components/columns';
import { Card, CardContent } from '@/components/ui/card';
import useGetAllBillboard from '@/queryHooks/useGetAllBillboard';
import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import LayoutLoader from '@/components/layout-loader';

const pageHeader = {
  title: 'Billboard List',
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

const BillboardListPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, total, isFetching, error } = useGetAllBillboard(page, limit);

  if (isFetching && !data) {
    return (
      <div>
        <LayoutLoader />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching billboards: {error.message}</div>;
  }

  const formattedBillboard: BillboardColumn[] =
    data?.map((item) => ({
      id: item.id,
      section: (item.section ?? 0).toString(),
      description: item.name ?? '',
      iStatus: item.iStatus || ('' as string),
      iShowedStatus: item.iShowedStatus || ('' as string),
      remarks: item.remarks ?? '',
      isImage: item.isImage as boolean,
      contentURL: item.contentURL ?? '',
    })) ?? [];

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <div>
        <Card className='mt-6'>
          <CardContent className='p-10'>
            <BillboardListTable
              data={formattedBillboard}
              currentPage={page}
              totalPages={Math.ceil((total ?? 0) / limit)}
              totalRecords={total ?? 0}
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

export default BillboardListPage;

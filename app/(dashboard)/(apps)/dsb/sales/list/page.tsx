'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceListTable } from './list-table';
import LayoutLoader from '@/components/layout-loader';
import { routes } from '@/config/routes';
import PageHeader from '@/components/page-header';
import useInvoiceHd from '@/queryHooks/useInvoiceHd';
import { InvoiceHdColumns } from './list-table/components/columns';
import { usePageStore } from '@/store';

const InvoiceHdListPage = () => {
  const { currentPage } = usePageStore();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [invoiceType, setInvoiceType] = useState<string | null>(null);

  const { data, total, isFetching, error } = useInvoiceHd({
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
    return <div>Error fetching invoiceHd: {error.message}</div>;
  }

  const formattedInvoiceHd: InvoiceHdColumns[] =
    data?.map((item) => ({
      invoiceDate: item.invoiceDate,
      invoice_id: item.invoice_id,
      customerName: item.customerName.trim(),
      invoiceType: item.invoiceType,
      total_amount: item.total_amount,
      salesPersonName: item.salesPersonName.trim(),
      invoiceStatus: item.invoiceStatus,
    })) ?? [];

  return (
    <>
      <PageHeader
        title='Invoice List'
        breadcrumb={[
          { name: 'Dashboard', href: routes.inventory.dashboard },
          { name: 'List' },
        ]}
      />
      <div>
        <Card className='mt-6'>
          <CardContent className='p-10'>
            <InvoiceListTable
              data={formattedInvoiceHd}
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

export default InvoiceHdListPage;

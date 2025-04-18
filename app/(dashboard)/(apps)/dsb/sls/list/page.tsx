'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceListTable } from './list-table';
import LayoutLoader from '@/components/layout-loader';
import { routes } from '@/config/routes';
import PageHeader from '@/components/page-header';
import useSalesInvoiceHd from '@/queryHooks/useSalesInvoiceHd';
import { SalesInvoiceHdColumns } from './list-table/components/columns';
import { usePageStore } from '@/store';

const InvoiceHdListPage = () => {
  // const { currentPage, sorting, setCurrentPage, setSorting } = usePageStore();
  const { currentPage, sorting, limit, setCurrentPage, setSorting, setLimit } =
    usePageStore();
  const [page, setPage] = useState(1);

  // const limit = 10;
  const sort = sorting?.[0];
  const orderBy = sort?.id ?? 'invoiceDate';
  const orderDir = sort?.desc ? 'desc' : 'asc';

  const { data, total, isFetching, error } = useSalesInvoiceHd({
    page: currentPage,
    limit,
    orderBy,
    orderDir,
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

  const formattedInvoiceHd: SalesInvoiceHdColumns[] =
    data?.map((item) => ({
      po_id: item.po_id ?? '',
      invoiceDate: item.invoiceDate,
      invoice_id: item.invoice_id.trim(),
      customerName: item.customerName.trim(),
      invoiceType: item.invoiceType.trim(),
      total_amount: item.total_amount,
      salesPersonName: item.salesPersonName.trim(),
      paidStatus: item.paidStatus,
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
              // currentPage={currentPage}
              currentPage={page}
              totalPages={Math.ceil((total ?? 0) / limit)}
              totalRecords={total}
              // onPageChange={setCurrentPage}
              onPageChange={setPage}
              limit={limit}
              setLimit={() => {}}
              sorting={sorting}
              setSorting={setSorting}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InvoiceHdListPage;

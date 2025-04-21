'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceListTable } from './list-table';
import LayoutLoader from '@/components/layout-loader';
import { routes } from '@/config/routes';
import PageHeader from '@/components/page-header';
import useSalesInvoiceHd from '@/queryHooks/useSalesInvoiceHd';
import { SalesInvoiceHdColumns } from './list-table/components/columns';
import { usePageStore } from '@/store';

const SalesInvoiceHdPage = () => {
  const { currentPage, sorting, limit, setCurrentPage, setSorting, setLimit } =
    usePageStore();
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
      invoiceTypeName: item.invoiceTypeName.trim(),
      invoicePoTypeName: item.invoicePoTypeName.trim(),
      invoiceType_id: item.invoiceType_id,
      total_amount: item.total_amount,
      salesPersonName: item.salesPersonName.trim(),
      paidStatus: item.paidStatus,
      monthYear: item.monthYear,
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
              currentPage={currentPage}
              totalPages={Math.ceil((total ?? 0) / limit)}
              totalRecords={total}
              onPageChange={setCurrentPage}
              limit={limit}
              setLimit={setLimit}
              sorting={sorting}
              setSorting={setSorting}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SalesInvoiceHdPage;

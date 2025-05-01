'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

import { InvoiceListTable } from './list-table';
import LayoutLoader from '@/components/layout-loader';
import { routes } from '@/config/routes';
import PageHeaderWrapper from '@/components/page-header-wrapper';
import useSalesInvoiceHd from '@/queryHooks/sls/useSalesInvoiceHd';
import { SalesPersonInvoiceListColumns } from './list-table/components/columns';
import { usePageStore } from '@/store';
import { FooterSummarySection } from '@/components/footer-summary-section';
import { FooterSummaryItem } from '@/components/footer-summary-item';

export default function SalesPersonInvoiceList() {
  const { currentPage, sorting, limit, setCurrentPage, setSorting, setLimit } =
    usePageStore();
  const sort = sorting?.[0];
  const orderBy = sort?.id ?? 'invoiceDate';
  const orderDir = sort?.desc ? 'desc' : 'asc';

  const { data, total, grandTotal_amount, isFetching, error } =
    useSalesInvoiceHd({
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

  const formattedInvoiceHd: SalesPersonInvoiceListColumns[] =
    data?.map((item) => ({
      poType: item.poType?.trim() ?? '',
      po_id: item.po_id ?? '',
      invoiceDate: item.invoiceDate,
      invoice_id: item.invoice_id.trim(),
      customerName: item.customerName.trim(),
      PoType: item.poType?.trim() ?? '',
      total_amount: item.total_amount,
      salesPersonName: item.salesPersonName.trim(),
      paidStatus: item.paidStatus,
      grandTotal_amount: item.grandTotal_amount,
    })) ?? [];

  return (
    <>
      {/* <PageHeaderWrapper
        show={true}
        title='Invoice List'
        breadcrumb={[
          { name: 'Sales Invoice', href: routes.inventory.dashboard },
          { name: 'List' },
        ]}
      /> */}

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

      {/* <Card className='mt-4'>
        <CardContent className='p-4'> */}
      <FooterSummarySection className='w-full flex justify-end'>
        <FooterSummaryItem label='Total Invoice' value={grandTotal_amount} />
      </FooterSummarySection>
      {/* </CardContent>
      </Card> */}
    </>
  );
}

// export default SalesPersonInvoiceList;

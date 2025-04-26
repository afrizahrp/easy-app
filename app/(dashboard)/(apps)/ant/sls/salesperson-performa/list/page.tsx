'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceListTable } from './list-table';
import LayoutLoader from '@/components/layout-loader';
import { routes } from '@/config/routes';
import PageHeader from '@/components/page-header';
import useSalesInvoiceHd from '@/queryHooks/sls/useSalesInvoiceHd';
import { SalesInvoiceHdColumns } from './list-table/components/columns';
import { usePageStore } from '@/store';
import { FooterSummarySection } from '@/components/footer-summary-section';
import { FooterSummaryItem } from '@/components/footer-summary-item';
import Sls_InvoiceFilterSummary from '@/components/sales/sls-invoiceFilter-Summary';

const SalesInvoiceHdPage = () => {
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

  const formattedInvoiceHd: SalesInvoiceHdColumns[] =
    data?.map((item) => ({
      poType: item.poType?.trim() ?? '',
      po_id: item.po_id ?? '',
      invoiceDate: item.invoiceDate,
      invoice_id: item.invoice_id.trim(),
      customerName: item.customerName.trim(),
      PoType: item.poType?.trim() ?? '',
      total_amount: item.total_amount,
      salesPersonName: item.salesPersonName.trim(),
      // paidStatus: item.paidStatus,
      grandTotal_amount: item.grandTotal_amount,
      // monthYear: item.monthYear,
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
            {/* <div className='flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg bg-muted/70 shadow-sm border border-muted-200'>
              <div className='flex items-center gap-2'>
                <span className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-5 h-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-7 7V21a1 1 0 01-2 0v-7.293l-7-7A1 1 0 013 6V4z'
                    />
                  </svg>
                </span>
                <span className='font-semibold text-base text-primary'>
                  Filter
                </span>
              </div>
              <div className='flex-1 min-w-[200px]'>
                <Sls_InvoiceFilterSummary />
              </div>
            </div> */}
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

      <Card className='mt-4'>
        <CardContent className='p-4'>
          <FooterSummarySection className='w-full flex justify-end'>
            <FooterSummaryItem
              label='Total Invoice'
              value={grandTotal_amount}
            />
          </FooterSummarySection>
        </CardContent>
      </Card>
    </>
  );
};

export default SalesInvoiceHdPage;

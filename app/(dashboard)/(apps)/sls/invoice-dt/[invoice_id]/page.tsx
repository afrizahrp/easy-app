'use client';

import { format } from 'date-fns';
import { routes } from '@/config/routes';
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Icon } from '@iconify/react';
import useCompanies from '@/queryHooks/use-companies';
import useSalesInvoiceDt from '@/queryHooks/useSalesInvoiceDt';
import LayoutLoader from '@/components/layout-loader';
import PageHeader from '@/components/page-header';

export default function SalesInvoiceDtPage({
  params,
}: {
  params: { invoice_id: string };
}) {
  const invoice_id = decodeURIComponent(params.invoice_id);
  const { data, isLoading, error } = useSalesInvoiceDt({
    invoiceId: invoice_id,
  });
  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();

  if (isLoading) {
    return <LayoutLoader />;
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-lg font-semibold text-default-600'>
          Error: {error.message}
        </div>
      </div>
    );
  }

  const invoice = data;

  if (!invoice) {
    return <div className='p-4'>No invoice data found.</div>;
  }

  const {
    customerName,
    invoiceDate,
    dueDate,
    total_amount,
    base_amount,
    taxRate,
    company_id,
    details,
  } = invoice;

  const formattedInvoiceDate =
    invoiceDate instanceof Date
      ? format(invoiceDate, 'dd/MM/yyyy')
      : format(new Date(invoiceDate as string | number), 'dd/MM/yyyy');

  return (
    <div>
      <PageHeader
        title='Invoice Detail List'
        breadcrumb={[
          { name: 'Sales' },
          { name: 'Invoice List', href: '/dsb/sls/invoice-hd/list' },
        ]}
      />
      <div className='grid grid-cols-12 gap-6 mt-6'>
        <div className='col-span-12'>
          <Card>
            <CardContent>
              <div className='flex gap-6 flex-col md:flex-row pt-8'>
                <div className='flex-1'>
                  <div className='mt-5'>
                    <div className='text-lg font-semibold text-default-900'>
                      Billing To:
                    </div>
                    <div className='text-lg font-medium text-default-800 mt-1'>
                      {customerName}
                    </div>
                  </div>
                </div>
                <div className='flex-none md:text-end'>
                  <div className='text-4xl font-semibold text-default-900'>
                    Invoice #
                  </div>
                  <div className='mt-1.5 text-xl font-medium text-default-600'>
                    {invoice_id}
                  </div>
                  <div className='mt-8'>
                    <div className='mb-2.5'>
                      <span className='text-base font-semibold text-default-900'>
                        Invoice Date:
                      </span>
                      <span className='ml-4 text-base text-default-600'>
                        {/* {invoiceDate.toISOString().slice(0, 10)} */}
                        {formattedInvoiceDate}
                      </span>
                    </div>
                    <div>
                      <span className='text-base font-semibold text-default-900'>
                        Due Date:
                      </span>
                      <span className='ml-4 text-base text-default-600'>
                        {dueDate ? dueDate.toISOString().slice(0, 10) : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-6 border border-default-300 rounded-md'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Shipping</TableHead>

                      <TableHead className='text-right'>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {details?.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.qty} pcs</TableCell>
                        <TableCell>
                          {(
                            Number(item.total_amount) / Number(item.qty)
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell className='text-right'>
                          {Number(item.total_amount).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className='mt-4 flex justify-end p-6'>
                  <div>
                    {[
                      {
                        label: 'Sub Total',
                        amount: Number(base_amount),
                      },
                      {
                        label: `TAX (${taxRate}%)`,
                        amount: (Number(base_amount) * taxRate!) / 100,
                      },
                      {
                        label: 'Total',
                        amount: Number(total_amount),
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className='mb-2 text-end flex justify-between gap-8'
                      >
                        <span className='text-sm font-medium text-default-600'>
                          {item.label}:
                        </span>
                        <span className='text-sm font-medium text-default-600'>
                          Rp {item.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* <div className='text-base font-medium text-default-600 mt-6'>
                Note:
              </div>
              <div className='text-sm text-default-800'>
                Thank you for your business!
              </div>

              <div className='mt-8 text-xs text-default-800'>
                © 2025 Your Company Name
              </div> */}
            </CardContent>
          </Card>

          <div className='mt-8 flex gap-4 justify-end'>
            <Button
              asChild
              variant='outline'
              className='text-xs font-semibold text-primary-500'
            >
              <Link href='#'>
                <Download className='w-3.5 h-3.5 ltr:mr-1.5 rtl:ml-1.5' />
                <span>Invoice PDF</span>
              </Link>
            </Button>
            <Button className='text-xs font-semibold '>
              <Icon icon='heroicons:printer' className='w-5 h-5 ltr:mr-1' />
              <span>Print</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

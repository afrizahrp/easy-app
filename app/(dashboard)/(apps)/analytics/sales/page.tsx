// analytics/page.tsx
// import SalesInvoiceOverview from './sales/salesinvoice-chart/components/SalesInvoiceOverview'; // Asumsi komponen ini ada
import SalesPersonPerformaOverview from '../sales/salespersonperforma-chart/components/salesPersonPerformaOverview';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Analytics Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Ringkasan Sales Invoice */}
        {/* <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Sales Invoice Overview</h2>
          <SalesInvoiceOverview />
        </div> */}
        {/* Ringkasan Salesperson Performance */}
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <h2 className='text-lg font-semibold mb-2'>
            Salesperson Performance
          </h2>
          <SalesPersonPerformaOverview isFullWidth={false} />{' '}
          {/* Props sesuai kebutuhan */}
        </div>
      </div>
      {/* Navigasi ke sub-modul */}
      <div className='mt-4'>
        <Link href='/analytics/sales' className='text-blue-600 hover:underline'>
          View Detailed Sales Analytics
        </Link>
      </div>
    </div>
  );
}

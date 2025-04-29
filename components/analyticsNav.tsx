// components/AnalyticsNav.tsx
import Link from 'next/link';

export default function AnalyticsNav() {
  return (
    <nav className='mb-4'>
      <Link href='/analytics' className='text-blue-600 hover:underline'>
        Dashboard
      </Link>
      <Link
        href='/analytics/sales'
        className='ml-4 text-blue-600 hover:underline'
      >
        Sales
      </Link>
      <Link
        href='/analytics/sales/salesinvoice-chart'
        className='ml-4 text-blue-600 hover:underline'
      >
        Sales Invoice
      </Link>
    </nav>
  );
}

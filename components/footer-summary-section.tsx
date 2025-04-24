import { ReactNode } from 'react';

interface FooterSummarySectionProps {
  children: ReactNode;
  className?: string;
}

export function FooterSummarySection({
  children,
  className = '',
}: FooterSummarySectionProps) {
  return (
    <div
      className={`w-full border-t mt-4 pt-4 flex items-center bg-muted/50 px-4 py-3 rounded-md shadow-sm ${className}`}
    >
      <div className='w-full flex justify-end'>
        {' '}
        {/* Menambahkan div pembungkus untuk flex end */}
        {children}
      </div>
    </div>
  );
}

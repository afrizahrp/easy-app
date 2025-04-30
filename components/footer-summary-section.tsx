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
      className={`w-full border-t mt-4 pt-4 flex items-center bg-secondary text-black px-4 py-3 rounded-md shadow-sm ${className}`}
    >
      <div className='w-full flex justify-end font-semibold text-md'>
        {children}
      </div>
    </div>
  );
}

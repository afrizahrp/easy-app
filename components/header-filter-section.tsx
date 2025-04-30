import { ReactNode } from 'react';

interface HeaderFilterSectionProps {
  children: ReactNode;
  className?: string;
}

export function HeaderFilterSection({
  children,
  className = '',
}: HeaderFilterSectionProps) {
  return (
    <div
      className={`w-full border-t mt-4 pt-4 flex items-center bg-slate-300 px-4 py-3 rounded-md shadow-sm ${className}`}
    >
      <div className='w-full flex justify-end'>{children}</div>
    </div>
  );
}

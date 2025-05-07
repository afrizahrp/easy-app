// components/filterSummary.tsx
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';
import { X } from 'lucide-react';

type FilterValue = string | number | null | undefined;

interface FilterSummaryProps {
  filters: {
    label: string;
    value: FilterValue | FilterValue[];
    isClearable?: boolean;
    onClear?: () => void;
  }[];
  layout?: 'grid' | 'inline' | 'badge';
  className?: string;
}

export function FilterSummary({
  filters,
  layout = 'grid',
  className,
}: FilterSummaryProps) {
  const renderValue = (value: FilterValue | FilterValue[]) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : '-';
    }
    return value ?? '-';
  };

  if (layout === 'badge') {
    return (
      <div className={clsx('flex flex-wrap gap-2', className)}>
        {filters.map((f, i) => (
          <Badge key={i} variant='secondary' className='flex items-center'>
            {f.label === 'Invoice Period' ? '' : `Selected ${f.label}: `}
            {renderValue(f.value)}
            {f.isClearable && f.onClear && (
              <button
                onClick={f.onClear}
                className='ml-2 text-xs text-red-500 hover:text-red-700'
                aria-label={`Clear ${f.label}`}
              >
                <X size={12} />
              </button>
            )}
          </Badge>
        ))}
      </div>
    );
  }

  if (layout === 'inline') {
    return (
      <div
        className={clsx(
          'text-sm flex flex-col justify-center items-center gap-1',
          className
        )}
      >
        {filters.map((f, i) => (
          <div key={i} className='flex items-center justify-center w-full'>
            <span className='text-center'>
              {f.label === 'Invoice Period' ? '' : ` ${f.label}: `}
              {renderValue(f.value)}
            </span>
            {f.isClearable && f.onClear && (
              <button
                onClick={f.onClear}
                className='ml-2 text-xs text-red-500 hover:text-red-700'
                aria-label={`Clear ${f.label}`}
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }
  // Default layout
  return (
    <div className={clsx('text-sm space-y-1', className)}>
      {filters.map((f, i) => (
        <div key={i} className='flex items-center'>
          <span>
            {f.label === 'Invoice Period' ? '' : `Selected ${f.label}: `}
            {renderValue(f.value)}
          </span>
          {f.isClearable && f.onClear && (
            <button
              onClick={f.onClear}
              className='ml-2 text-xs text-red-500 hover:text-red-700'
              aria-label={`Clear ${f.label}`}
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

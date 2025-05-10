import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';
import { X } from 'lucide-react';
import React from 'react';

type FilterValue = string | number | null | undefined | string[];

interface DashboardFilterSummaryProps {
  filters: {
    label: string;
    value: FilterValue;
    isClearable?: boolean;
    onClear?: () => void;
    individualYears?: string[];
    onClearIndividual?: (year: string) => void;
  }[];
  layout?: 'grid' | 'inline' | 'badge';
  className?: string;
}

export const DashboardFilterSummary = React.memo(
  ({ filters, layout = 'inline', className }: DashboardFilterSummaryProps) => {
    console.log('DashboardFilterSummary filters:', filters); // Debugging

    const renderValue = (filter: DashboardFilterSummaryProps['filters'][0]) => {
      const { value, individualYears, onClearIndividual, label } = filter;

      if (Array.isArray(value)) {
        return (
          <div className='flex items-center gap-2 whitespace-nowrap'>
            {/* Tampilkan label sebagai teks */}
            <span className='font-medium'>
              {label === 'Invoice Period' ? '' : `${label}:`}
            </span>
            {/* Render badge untuk tahun */}
            <div className='flex items-center gap-1'>
              <Badge variant='secondary' className='flex items-center gap-1'>
                {value.length === 0 && '-'}
                {value.map((year, index) => {
                  const isNonDefault = individualYears?.includes(year);
                  const isLast = index === value.length - 1;
                  const isSecondToLast = index === value.length - 2;
                  return (
                    <span key={year} className='flex items-center'>
                      {year}
                      {isNonDefault && onClearIndividual && (
                        <button
                          onClick={() => onClearIndividual(year)}
                          className='ml-1 text-xs text-red-500 hover:text-red-700'
                          aria-label={`Clear year ${year}`}
                        >
                          <X size={12} />
                        </button>
                      )}
                      {!isLast && (
                        <span className='mx-1'>
                          {value.length > 2 || (value.length === 2 && !isLast)
                            ? isSecondToLast
                              ? 'and'
                              : ','
                            : ''}
                        </span>
                      )}
                    </span>
                  );
                })}
              </Badge>
            </div>
          </div>
        );
      }

      // Logika default untuk value non-array
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : '-';
      }
      return value ?? '-';
    };

    if (layout === 'inline') {
      return (
        <div
          className={clsx(
            'text-sm flex items-center justify-center gap-2 whitespace-nowrap',
            className
          )}
        >
          {filters.map((f, i) => (
            <div key={i} className='flex items-center'>
              {renderValue(f)}
              {f.isClearable && f.onClear && !f.individualYears && (
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

    // Layout lain (grid, badge) jika diperlukan
    return (
      <div className={clsx('text-sm space-y-1', className)}>
        {filters.map((f, i) => (
          <div key={i} className='flex items-center'>
            <span>
              {f.label === 'Invoice Period' ? '' : `Selected ${f.label}: `}
              {renderValue(f)}
            </span>
            {f.isClearable && f.onClear && !f.individualYears && (
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
);

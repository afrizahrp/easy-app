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
  ({ filters, layout = 'grid', className }: DashboardFilterSummaryProps) => {
    // console.log('DashboardFilterSummary filters:', filters); // Debugging

    const renderValue = (filter: DashboardFilterSummaryProps['filters'][0]) => {
      const { value, individualYears, onClearIndividual, label } = filter;

      if (Array.isArray(value)) {
        // Kasus untuk Months: Gunakan value langsung (misalnya, ["As At Mar"] atau ["Jan, Mar, and Apr"])
        if (label === 'Months') {
          return (
            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
              <span className='font-medium'>{`Selected ${label}:`}</span>
              <div className='flex items-center gap-1'>
                <Badge variant='secondary' className='flex items-center gap-1'>
                  {value.length === 0 ? '-' : value[0]}
                </Badge>
                {/* Tampilkan ikon X untuk setiap bulan di individualYears */}
                {individualYears &&
                  individualYears.length > 0 &&
                  onClearIndividual && (
                    <div className='flex items-center gap-1 ml-2'>
                      {individualYears.map((item) => (
                        <Badge
                          key={item}
                          variant='secondary'
                          className='flex items-center gap-1'
                        >
                          {item}
                          <button
                            onClick={() => onClearIndividual(item)}
                            className='ml-1 text-xs text-red-500 hover:text-red-700'
                            aria-label={`Clear ${label.toLowerCase()} ${item}`}
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          );
        }

        // Kasus untuk Companies dan Years
        return (
          <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
            <span className='font-medium'>{`Selected ${label}:`}</span>
            <div className='flex items-center gap-1'>
              <Badge variant='secondary' className='flex items-center gap-1'>
                {value.length === 0 && '-'}
                {value.map((item, index) => {
                  const isNonDefault = individualYears?.includes(item);
                  const isLast = index === value.length - 1;
                  const isSecondToLast = index === value.length - 2;
                  return (
                    <span key={item} className='flex items-center'>
                      {item}
                      {isNonDefault && onClearIndividual && (
                        <button
                          onClick={() => onClearIndividual(item)}
                          className='ml-1 text-xs text-red-500 hover:text-red-700'
                          aria-label={`Clear ${label.toLowerCase()} ${item}`}
                        >
                          <X size={12} />
                        </button>
                      )}
                      {!isLast && (
                        <span className='mx-1'>
                          {value.length > 2 || (value.length === 2 && !isLast)
                            ? isSecondToLast
                              ? ' and '
                              : ', '
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
      return (
        <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
          <span className='font-medium'>{`Selected ${label}:`}</span>
          <Badge variant='secondary'>{value ?? '-'}</Badge>
        </div>
      );
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
              {f.isClearable && f.onClear && !f.individualYears?.length && (
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

    // Tata letak vertikal (grid atau badge)
    return (
      <div
        className={clsx('text-sm flex flex-col gap-2 items-center', className)}
      >
        {filters.map((f, i) => (
          <div key={i} className='flex items-center'>
            {renderValue(f)}
            {f.isClearable && f.onClear && !f.individualYears?.length && (
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

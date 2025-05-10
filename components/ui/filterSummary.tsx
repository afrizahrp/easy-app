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
    individualValues?: string[];
    onClearIndividual?: (value: string) => void;
  }[];
  layout?: 'grid' | 'inline' | 'badge';
  className?: string;
}

export function FilterSummary({
  filters,
  layout = 'grid',
  className,
}: FilterSummaryProps) {
  const renderValue = (filter: FilterSummaryProps['filters'][0]) => {
    const { value, individualValues, onClearIndividual, label } = filter;

    if (Array.isArray(value)) {
      return (
        <div className='flex items-center gap-2 whitespace-nowrap'>
          <span className='font-medium'>
            {label === 'Invoice Period' ? '' : `${label}:`}
          </span>
          <div className='flex items-center gap-1'>
            <Badge variant='secondary' className='flex items-center gap-1'>
              {value.length === 0 && '-'}
              {value.map((item, index) => {
                const isNonDefault = individualValues?.includes(String(item)); // Konversi ke string untuk perbandingan
                const isLast = index === value.length - 1;
                const isSecondToLast = index === value.length - 2;
                return (
                  <span key={String(item)} className='flex items-center'>
                    {String(item)}
                    {isNonDefault &&
                      onClearIndividual &&
                      typeof item === 'string' && (
                        <button
                          onClick={() => onClearIndividual(item)}
                          className='ml-1 text-xs text-red-500 hover:text-red-700'
                          aria-label={`Clear ${item}`}
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

    return value ?? '-';
  };

  if (layout === 'badge') {
    return (
      <div className={clsx('flex flex-wrap gap-2', className)}>
        {filters.map((filter, index) => (
          <Badge key={index} variant='secondary' className='flex items-center'>
            {Array.isArray(filter.value) ? (
              renderValue(filter)
            ) : (
              <>
                {filter.label === 'Invoice Period'
                  ? ''
                  : `Selected ${filter.label}: `}
                {renderValue(filter)}
              </>
            )}
            {filter.isClearable &&
              filter.onClear &&
              !filter.individualValues && (
                <button
                  onClick={filter.onClear}
                  className='ml-2 text-xs text-red-500 hover:text-red-700'
                  aria-label={`Clear ${filter.label}`}
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
          'text-sm flex items-center gap-2 whitespace-nowrap',
          className
        )}
      >
        {filters.map((filter, index) => (
          <div key={index} className='flex items-center'>
            {renderValue(filter)}
            {filter.isClearable &&
              filter.onClear &&
              !filter.individualValues && (
                <button
                  onClick={filter.onClear}
                  className='ml-2 text-xs text-red-500 hover:text-red-700'
                  aria-label={`Clear ${filter.label}`}
                >
                  <X size={12} />
                </button>
              )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('text-sm space-y-1', className)}>
      {filters.map((filter, index) => (
        <div key={index} className='flex items-center'>
          {Array.isArray(filter.value) ? (
            renderValue(filter)
          ) : (
            <span>
              {filter.label === 'Invoice Period'
                ? ''
                : `Selected ${filter.label}: `}
              {renderValue(filter)}
            </span>
          )}
          {filter.isClearable && filter.onClear && !filter.individualValues && (
            <button
              onClick={filter.onClear}
              className='ml-2 text-xs text-red-500 hover:text-red-700'
              aria-label={`Clear ${filter.label}`}
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

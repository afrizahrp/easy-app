import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';
import { X } from 'lucide-react'; // Kamu bisa pakai ikon lainnya, atau import yang sesuai

type FilterValue = string | number | null | undefined;

interface FilterSummaryProps {
  filters: {
    label: string;
    value: FilterValue | FilterValue[];
    isClearable?: boolean; // Properti isClearable untuk pengecualian field yang tidak bisa di-clear
    onClear?: () => void; // Tambahkan prop onClear untuk reset
  }[];
  layout?: 'grid' | 'inline' | 'badge'; // default: 'grid'
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
            {f.label}: {renderValue(f.value)}
            {/* Tambahkan tombol clear jika ada onClear */}
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
      <div className={clsx('text-sm space-x-4', className)}>
        {filters.map((f, i) => (
          <span key={i} className='flex items-center'>
            <strong>{f.label}</strong>: {renderValue(f.value)}
            {f.isClearable && f.onClear && (
              <button
                onClick={f.onClear}
                className='ml-2 text-xs text-red-500 hover:text-red-700'
                aria-label={`Clear ${f.label}`}
              >
                <X size={12} />
              </button>
            )}
          </span>
        ))}
      </div>
    );
  }

  // Default layout: grid
  return (
    <div
      className={clsx(
        'grid grid-cols-2 md:grid-cols-3 gap-y-1 text-sm',
        className
      )}
    >
      {filters.map((f, i) => (
        <div key={i} className='flex items-center'>
          <strong>{f.label}</strong>: {renderValue(f.value)}
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

// analytics/sales/salesinvoice-chart/components/SalesByPoType.tsx
'use client';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useToast } from '@/components/ui/use-toast';
import useSalesByPeriodAndPoType from '@/queryHooks/sls/dashboard/useSalesByPeriodAndPoType';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SalesByPoTypeProps {
  isFullWidth?: boolean;
  onModeChange?: (isFull: boolean) => void;
}

const SalesByPoType: React.FC<SalesByPoTypeProps> = ({
  isFullWidth,
  onModeChange,
}) => {
  const { toast } = useToast();
  const { data, isLoading, isFetching, error } = useSalesByPeriodAndPoType();

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((yearData) => {
      const poTypes = Object.keys(yearData.poTypes);
      const colors: Record<string, string> = {
        eCatalog: 'rgba(75, 192, 192, 0.6)',
        Regular: 'rgba(255, 99, 132, 0.6)',
        Unknown: 'rgba(201, 203, 207, 0.6)',
      };
      return {
        labels: poTypes,
        datasets: [
          {
            label: `Sales ${yearData.period}`,
            data: poTypes.map((poType) => yearData.poTypes[poType]),
            backgroundColor: poTypes.map(
              (poType) => colors[poType] || colors.Unknown
            ),
            borderColor: poTypes.map((poType) =>
              (colors[poType] || colors.Unknown).replace('0.6', '1')
            ),
            borderWidth: 1,
          },
        ],
      };
    });
  }, [data]);

  React.useEffect(() => {
    if (error) {
      toast({
        description:
          error.message ||
          'Failed to load sales by PO type data. Please try again.',
        color: 'destructive',
      });
    }
  }, [error, toast]);

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm min-h-96 relative flex flex-col'>
      <h2 className='text-md font-semibold mb-2'>Sales by PO Type</h2>
      <div className='absolute top-2 right-2 flex items-center space-x-2 z-10'>
        <Label htmlFor='chart-mode-potype'>
          {isFullWidth ? 'Full Width' : 'Half Width'}
        </Label>
        <Switch
          id='chart-mode-potype'
          checked={isFullWidth}
          onCheckedChange={(checked) => onModeChange?.(checked)}
        />
      </div>
      {isLoading || isFetching ? (
        <div className='flex items-center justify-center h-full'>
          <div className='w-3/4 h-1/2 rounded-lg shimmer' />
        </div>
      ) : chartData.length > 0 ? (
        <div
          className={`flex-1 mt-4 ${
            chartData.length === 1
              ? 'flex items-center justify-center'
              : 'grid grid-cols-1 md:grid-cols-2 gap-4'
          }`}
        >
          {chartData.map((chart, index) => (
            <div
              key={index}
              className='flex flex-col items-center justify-center'
            >
              <h3 className='text-sm font-medium text-center mb-2'>
                {chart.datasets[0].label}
              </h3>
              <div className='flex items-center justify-center w-full'>
                <div
                  className={`relative aspect-square ${isFullWidth ? 'w-80' : 'w-48'} flex items-center justify-center`}
                >
                  <Pie
                    data={chart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                          callbacks: {
                            label: (context) =>
                              ` ${(context.raw as number).toLocaleString('id-ID')}`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-full text-gray-400'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='w-24 h-24 mb-4 animate-bounce'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={1.5}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3 3v18h18V3H3zm5 14h8m-8-4h8m-8-4h8'
            />
          </svg>
          <p className='text-sm font-medium'>No data available</p>
        </div>
      )}
    </div>
  );
};

export default SalesByPoType;

'use client';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useToast } from '@/components/ui/use-toast';
import useSalesByPeriodAndPoType from '@/queryHooks/sls/dashboard/useSalesByPeriodAndPoType';
import { Label } from '@/components/ui/label'; // Impor Label untuk memberikan teks pada Switch
import { Switch } from '@/components/ui/switch';

ChartJS.register(ArcElement, Tooltip, Legend);
interface SalesByPeriodAndPoTypeChartProps {
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
}

const SalesByPeriodAndPoTypeChart = ({
  isFullWidth,
  onModeChange,
}: SalesByPeriodAndPoTypeChartProps) => {
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
    // <div className='bg-white p-4 rounded-lg shadow-sm'>
    <div className='bg-white p-4 rounded-lg shadow-sm relative'>
      <h2 className='text-md font-semibold mb-2'>
        Sales by Period and PO Type
      </h2>
      <div className='absolute top-2 right-2 flex items-center space-x-2'>
        <Switch
          id={`chart-mode-potype}`}
          checked={isFullWidth}
          onCheckedChange={(checked) => onModeChange?.(checked)}
        />
        <Label htmlFor={`chart-mode-potype}`}>
          {isFullWidth ? 'Half Width' : 'Full Width'}
        </Label>
      </div>
      {isLoading || isFetching ? (
        <div className='text-center text-gray-500'>Loading...</div>
      ) : chartData.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {chartData.map((chart, index) => (
            <div key={index} className='h-96 flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-medium text-center'>
                  {chart.datasets[0].label}
                </h3>
              </div>
              <div className='flex-1 relative'>
                <Pie
                  data={chart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: {
                        callbacks: {
                          label: (context) =>
                            ` ${(context.raw as number).toLocaleString(
                              'id-ID'
                            )}`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center text-red-500'>No data available</div>
      )}
    </div>
  );
};

export default SalesByPeriodAndPoTypeChart;

'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { hslToHex } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useSalesByPeriodAndPoType from '@/queryHooks/sls/dashboard/useSalesByPeriodAndPoType';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { months } from '@/utils/monthNameMap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

interface SalesInvoiceByPoTypeChartProps {
  height?: number;
  isFullWidth?: boolean;
  onModeChange?: (isFull: boolean) => void;
}

const SalesInvoiceByPoTypeChart: React.FC<SalesInvoiceByPoTypeChartProps> = ({
  height,
  isFullWidth,
  onModeChange,
}) => {
  const { theme: config, setTheme: setConfig } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const hslBackground = `hsla(${
    theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].background
  })`;
  const hexBackground = hslToHex(hslBackground);

  const { toast } = useToast();
  const { data, isLoading, isFetching, error } = useSalesByPeriodAndPoType();

  function getRandomColor(alpha = 1) {
    const r = Math.floor(Math.random() * 200) + 30;
    const g = Math.floor(Math.random() * 200) + 30;
    const b = Math.floor(Math.random() * 200) + 30;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return null;

    return {
      labels: months,
      datasets: data.map(
        (poTypeData: {
          poType: string;
          period: string;
          months: Record<string, number>;
        }) => {
          const color = getRandomColor(1);
          const bgColor = getRandomColor(0.2);
          return {
            // label: poTypeData.poType,
            label: `${poTypeData.poType} (${poTypeData.period})`,

            data: months.map((month) => poTypeData.months[month] || 0),
            borderColor: color,
            backgroundColor: bgColor,
            tension: 0.4,
          };
        }
      ),
    };
  }, [data]);

  const maxValue = React.useMemo(() => {
    if (!chartData) return 0;
    return Math.max(...chartData.datasets.flatMap((ds) => ds.data));
  }, [chartData]);

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
    <div
      className='bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm h-96 flex flex-col'
      style={{ backgroundColor: hexBackground }}
    >
      <div className='relative flex items-center justify-center mb-2'>
        <h2 className='text-md text-muted-foreground font-semibold mx-auto'>
          Monthly Sales Invoice by PO Type (in Millions IDR)
        </h2>
        <div className='absolute right-0 top-0 flex items-center space-x-2'>
          <Label htmlFor='chart-mode-potype'>
            {isFullWidth ? 'Full Width' : 'Half Width'}
          </Label>
          <Switch
            id='chart-mode-potype'
            checked={isFullWidth}
            onCheckedChange={(checked) => onModeChange?.(checked)}
            aria-label='Toggle full width chart'
          />
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className='flex items-center justify-center h-full'>
          <div className='w-3/4 h-1/2 rounded-lg shimmer' />
        </div>
      ) : chartData ? (
        <div className='flex-1 mt-4'>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${context.dataset.label}: ${(context.raw as number).toLocaleString('id-ID')} IDR`,
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: 'Months' },
                },
                y: {
                  beginAtZero: true,
                  min: maxValue < 1_000_000_000 ? 100_000_000 : undefined,

                  ticks: {
                    callback: (value) => {
                      const val = Number(value) / 1000000;
                      return `${val.toLocaleString('id-ID')}`;
                    },
                  },
                },
              },
            }}
          />
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

export default SalesInvoiceByPoTypeChart;

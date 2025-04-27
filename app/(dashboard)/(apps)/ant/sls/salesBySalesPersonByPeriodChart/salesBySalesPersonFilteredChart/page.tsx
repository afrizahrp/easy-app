'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScriptableContext,
} from 'chart.js';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useSalesByPeriodFiltered from '@/queryHooks/sls/analytics/useSalesPersonByPeriodFiltered';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

interface SalesDataWithFilter {
  period: string;
  totalInvoice: number;
  salesPersonName: string;
  months: { [month: string]: number };
}

interface SalesBySalesPersonFilteredProps {
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  salesPersonNames: string[]; // Wajib untuk filtered
}

const SalesBySalesPersonFilteredChart: React.FC<
  SalesBySalesPersonFilteredProps
> = ({ isFullWidth = false, onModeChange, salesPersonNames }) => {
  const { toast } = useToast();
  const { data, isLoading, isFetching, error } = useSalesByPeriodFiltered({
    salesPersonNames,
  });

  React.useEffect(() => {
    console.log('Data dari FilteredSalesPersonChart:', data);
  }, [data]);

  const chartData = React.useMemo(() => {
    if (!data || !data.length) return null;

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const colorPalette = [
      ['#1e3a8a', '#3b82f6'],
      ['#10b981', '#6ee7b7'],
      ['#e11d48', '#f472b6'],
      ['#9333ea', '#c084fc'],
      ['#f59e0b', '#fcd34d'],
      ['#0ea5e9', '#7dd3fc'],
    ];

    const datasets = data.map((entry: SalesDataWithFilter, idx: number) => {
      const monthsData = entry.months || {};
      return {
        label: entry.salesPersonName,
        data: months.map((month) => monthsData[month] || 0),
        backgroundColor: (ctx: ScriptableContext<'bar'>) => {
          const { chartArea, ctx: canvasCtx } = ctx.chart;
          const [from, to] = colorPalette[idx % colorPalette.length];
          if (!chartArea) return to;
          const gradient = canvasCtx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, from);
          gradient.addColorStop(1, to);
          return gradient;
        },
        borderColor: colorPalette[idx % colorPalette.length][0],
        borderWidth: 1,
      };
    });

    return { labels: months, datasets };
  }, [data]);

  const maxValue = React.useMemo(() => {
    if (!chartData || !chartData.datasets.length) return 100_000_000;
    const max = Math.max(...chartData.datasets.flatMap((ds) => ds.data), 0);
    return max || 100_000_000;
  }, [chartData]);

  React.useEffect(() => {
    if (error) {
      toast({
        description:
          error.message || 'Failed to load sales data. Please try again.',
        color: 'destructive',
      });
    }
  }, [error, toast]);

  const isDataReady =
    !!chartData &&
    Array.isArray(chartData.labels) &&
    chartData.labels.length > 0 &&
    Array.isArray(chartData.datasets) &&
    chartData.datasets.some((ds) => ds.data.some((value) => value > 0));

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm h-96'>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-md font-semibold'>
          Sales by Period (in Millions IDR)
        </h2>
        <div className='flex items-center space-x-2'>
          <Switch
            id='chart-mode-period'
            checked={isFullWidth}
            onCheckedChange={(checked) => onModeChange?.(checked)}
            aria-label='Toggle full width chart'
          />
          <Label htmlFor='chart-mode-period'>
            {isFullWidth ? 'Full Width' : 'Half Width'}
          </Label>
        </div>
      </div>
      {isLoading || isFetching ? (
        <div className='h-72 flex flex-col gap-2'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-48 w-full' />
        </div>
      ) : isDataReady ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: { bottom: 20 },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: maxValue * 1.1,
                title: { display: true, text: 'Total Sales (Million IDR)' },
                ticks: {
                  callback: (value) =>
                    `${(Number(value) / 1_000_000).toLocaleString('id-ID')}`,
                },
              },
              x: {
                title: { display: true, text: 'Month' },
                grid: { display: false },
              },
            },
            plugins: {
              legend: { position: 'top' },
              title: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `${(context.raw as number).toLocaleString('id-ID')} IDR`,
                },
              },
            },
          }}
        />
      ) : (
        <Alert color='destructive'>
          <AlertDescription>
            <div>No data available for the selected period.</div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SalesBySalesPersonFilteredChart;

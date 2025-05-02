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
} from 'chart.js';
import { hslToHex } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useSalesPeriod from '@/queryHooks/sls/dashboard/useSalesPeriod';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { months } from '@/utils/monthNameMap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

interface SalesInvoiceByPeriodChartProps {
  height?: number;
  isCompact?: boolean;
  isFullWidth?: boolean;
  onModeChange?: (isFull: boolean) => void;
}

const SalesInvoiceByPeriodChart: React.FC<SalesInvoiceByPeriodChartProps> = ({
  height = 400,
  isCompact = false,
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
  const { data, isLoading, isFetching, error } = useSalesPeriod();

  const chartData = React.useMemo(() => {
    if (!data) return null;

    const allYears = data.map((d) => d.period);

    const colorPalette = [
      ['#1e3a8a', '#3b82f6'], // Navy → Blue
      ['#10b981', '#6ee7b7'], // Green → Light Green
      ['#e11d48', '#f472b6'], // Red → Pink
      ['#9333ea', '#c084fc'], // Purple
      ['#f59e0b', '#fcd34d'], // Amber
      ['#0ea5e9', '#7dd3fc'], // Sky
    ];

    const datasets = allYears.map((year, idx) => ({
      label: `Sales ${year}`,
      data: months.map((month) => {
        const yearData = data.find((d) => d.period === year);
        return yearData?.months[month] || 0;
      }),
      backgroundColor: (ctx: import('chart.js').ScriptableContext<'bar'>) => {
        const chart = ctx.chart;
        const { ctx: canvasCtx, chartArea } = chart;

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
      barThickness: 25,
      borderRadius: 15,
    }));

    return {
      labels: months,
      datasets,
    };
  }, [data]);

  const maxValue = React.useMemo(() => {
    if (!chartData) return 0;
    return Math.max(...chartData.datasets.flatMap((ds) => ds.data));
  }, [chartData]);

  React.useEffect(() => {
    if (error) {
      toast({
        description: 'Failed to load sales data. Please try again.',
        color: 'destructive',
      });
    }
  }, [error, toast]);

  const isDataReady =
    !!chartData &&
    Array.isArray(chartData.labels) &&
    chartData.labels.length > 0 &&
    Array.isArray(chartData.datasets) &&
    chartData.datasets.some(
      (ds) => Array.isArray(ds.data) && ds.data.length > 0
    );

  return (
    <div
      className={`chart-container ${isCompact ? 'compact' : ''} bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm flex flex-col h-fit min-h-0`}
      style={{ backgroundColor: hexBackground }}
    >
      <div className='relative flex items-center mb-2'>
        <h2 className='text-sm text-muted-foreground font-semibold ml-2'>
          Sales Invoice by Monthly Period (in Millions IDR)
        </h2>
        <div className='absolute right-0 top-0 flex items-center text-muted-foreground text-xs space-x-2'>
          <Label htmlFor='chart-mode-period'>
            {isFullWidth ? 'Full Width' : 'Half Width'}
          </Label>
          <Switch
            id='chart-mode-period'
            checked={isFullWidth}
            onCheckedChange={(checked) => onModeChange?.(checked)}
            aria-label='Toggle full width chart'
          />
        </div>
      </div>
      <div className='flex-1 min-h-0'>
        {isLoading || isFetching ? (
          <div className='flex items-center justify-center h-full'>
            <div className='w-3/4 h-1/2 rounded-lg shimmer' />
          </div>
        ) : isDataReady ? (
          <Bar
            width={isFullWidth ? 600 : 300}
            height={isCompact ? 250 : height} // Kurangi tinggi di mode compact
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  bottom: isCompact ? 10 : 20, // Kurangi padding di mode compact
                  top: isCompact ? 5 : 10,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  min: maxValue < 1_000_000_000 ? 100_000_000 : undefined,
                  ticks: {
                    callback: (value: unknown) => {
                      const val = Number(value) / 1000000;
                      return `${val.toLocaleString('id-ID')}`;
                    },
                  },
                },
                x: {
                  title: { display: false, text: 'Month' },
                  ticks: {
                    callback: (value, index, ticks) => {
                      return chartData.labels[index] ?? '';
                    },
                  },
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                legend: {
                  display: !isCompact, // Sembunyikan legenda di mode compact
                  position: 'top',
                },
                title: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      ` ${(context.raw as number).toLocaleString('id-ID')}`,
                  },
                },
              },
            }}
          />
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
    </div>
  );
};

export default SalesInvoiceByPeriodChart;

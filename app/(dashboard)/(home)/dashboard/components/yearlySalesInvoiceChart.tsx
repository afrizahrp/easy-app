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
import { motion } from 'framer-motion';
import { hslToHex, generateYearColorPalette } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useYearlySalesInvoice from '@/queryHooks/dashboard/sales/useYearlySalesInvoice';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Years } from '@/utils/getYears';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

interface YearlySalesInvoiceChartProps {
  height?: number;
  isCompact?: boolean;
  isFullWidth?: boolean;
  onModeChange?: (isFull: boolean) => void;
}

const YearlySalesInvoiceChart: React.FC<YearlySalesInvoiceChartProps> = ({
  height = 400,
  isCompact = false,
  isFullWidth = false,
  onModeChange,
}) => {
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const hslBackground = `hsla(${
    theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].background
  })`;
  const hexBackground = hslToHex(hslBackground);
  const { toast } = useToast();
  const { data, isLoading, isFetching, error } = useYearlySalesInvoice();

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return null;

    // Gunakan tahun dari data, urutkan sesuai Years
    const years = data
      .map((d) => d.period)
      .sort((a, b) => Years.indexOf(a) - Years.indexOf(b));

    // Generate palet warna untuk semua tahun di Years
    const fullColorPalette = generateYearColorPalette(Years);

    // Pilih warna hanya untuk tahun yang ada di data
    const colorPalette = years.map((year) => {
      const yearIndex = Years.indexOf(year);
      return fullColorPalette[yearIndex] || ['#1e3a8a', '#3b82f6']; // Fallback
    });

    const dataset = {
      label: 'Sales Invoice (Millions IDR)',
      data: years.map((year) => {
        const yearData = data.find((d) => d.period === year);
        return yearData ? yearData.totalInvoice / 1_000_000 : 0;
      }),
      backgroundColor: (ctx: import('chart.js').ScriptableContext<'bar'>) => {
        const chart = ctx.chart;
        const { ctx: canvasCtx, chartArea } = chart;

        // Gunakan warna berdasarkan tahun
        const year = years[ctx.dataIndex];
        const yearIndex = Years.indexOf(year);
        const [from, to] = fullColorPalette[yearIndex] || [
          '#1e3a8a',
          '#3b82f6',
        ];

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
      borderColor: colorPalette.map(([from]) => from),
      borderWidth: 1,
      barThickness: 25,
      borderRadius: 15,
    };

    return {
      labels: years,
      datasets: [dataset],
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
        variant: 'destructive',
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
    <motion.div
      className={`chart-container ${isCompact ? 'compact' : ''} bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm flex flex-col h-fit min-h-[250px] w-full`}
      style={{ backgroundColor: hexBackground }}
      animate={{
        opacity: isFullWidth ? 1 : 0.95,
        scale: isFullWidth ? 1 : 0.98,
      }}
      initial={{
        opacity: isFullWidth ? 1 : 0.95,
        scale: isFullWidth ? 1 : 0.98,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className='relative flex items-center mb-2'>
        <h2 className='text-sm text-muted-foreground font-semibold ml-2'>
          Yearly Sales Invoice (in Millions IDR)
        </h2>
        {!isCompact && (
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
        )}
      </div>
      <div className='flex-1 min-h-0 w-full'>
        {isLoading || isFetching ? (
          <div className='flex items-center justify-center h-full'>
            <div className='w-3/4 h-1/2 rounded-lg shimmer' />
          </div>
        ) : isDataReady ? (
          <Bar
            key={isFullWidth ? 'full' : 'half'}
            height={isCompact ? 250 : height}
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  bottom: isCompact ? 10 : 20,
                  top: isCompact ? 5 : 10,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    drawTicks: false,
                    color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`,
                  },
                  ticks: {
                    callback: (value: unknown) => {
                      const val = Number(value);
                      return `${val.toLocaleString('id-ID')}`;
                    },
                  },
                },
                x: {
                  title: { display: false, text: 'Year' },
                  ticks: {
                    callback: (value, index) => chartData.labels[index] ?? '',
                  },
                  grid: {
                    drawTicks: false,
                    color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`,
                    display: false,
                  },
                },
              },
              plugins: {
                legend: {
                  display: !isCompact,
                  position: 'top',
                },
                title: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${(context.raw as number).toLocaleString('id-ID')} million IDR`,
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
    </motion.div>
  );
};

export default YearlySalesInvoiceChart;

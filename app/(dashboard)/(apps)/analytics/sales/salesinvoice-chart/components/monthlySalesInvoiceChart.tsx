'use client';

import React, { useState, useRef, useEffect } from 'react';
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
import { useSearchParams, useRouter } from 'next/navigation';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useMonthlySalesInvoice from '@/queryHooks/analytics/sales/useMonthlySalesInvoice';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
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

interface MonthlySalesInvoiceChartProps {
  height?: number;
  isCompact?: boolean;
  isFullWidth?: boolean;
  onModeChange?: (isFull: boolean) => void;
  startPeriod?: string;
  endPeriod?: string;
}

const MonthlySalesInvoiceChart: React.FC<MonthlySalesInvoiceChartProps> = ({
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
  const searchParams = useSearchParams();

  const { data, isLoading, isFetching, error } = useMonthlySalesInvoice({
    context: 'salesInvoice',
  });

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!chartContainerRef.current) return;

    if (!isFullScreen) {
      const requestFullscreen =
        chartContainerRef.current.requestFullscreen ||
        (chartContainerRef.current as any).webkitRequestFullscreen ||
        (chartContainerRef.current as any).mozRequestFullScreen ||
        (chartContainerRef.current as any).msRequestFullscreen;

      if (requestFullscreen) {
        requestFullscreen.call(chartContainerRef.current);
      } else {
        setIsFullScreen(true);
      }
    } else {
      if (document.fullscreenElement) {
        const exitFullscreen =
          document.exitFullscreen ||
          (document as any).webkitExitFullscreen ||
          (document as any).mozCancelFullScreen ||
          (document as any).msExitFullscreen;

        if (exitFullscreen) {
          exitFullscreen.call(document);
        }
      } else {
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullScreen = !!document.fullscreenElement;
      setIsFullScreen(isNowFullScreen);
      onModeChange?.(isNowFullScreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'MSFullscreenChange',
        handleFullscreenChange
      );
    };
  }, [onModeChange]);

  const chartData = React.useMemo(() => {
    if (!data) return null;

    const allYears = data.map((d) => d.period);
    const colorPalette = generateYearColorPalette(allYears);

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
      barThickness: isFullScreen ? 30 : 25,
      borderRadius: 15,
    }));

    return {
      labels: months,
      datasets,
    };
  }, [data, isFullScreen]);

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

  // const handleBack = () => {
  //   router.push('/dashboard');
  // };

  return (
    <motion.div
      ref={chartContainerRef}
      className={`chart-container ${isCompact ? 'compact' : ''} ${
        isFullScreen && !document.fullscreenElement
          ? 'fixed inset-0 z-50 bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-md'
          : 'relative bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm'
      } flex flex-col h-fit min-h-[250px] w-full`}
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
      <div className='relative flex items-center justify-between mb-2'>
        <h2 className='text-sm text-muted-foreground font-semibold ml-2'>
          Sales Invoice by Monthly (in Millions IDR)
        </h2>
        <div className='flex items-center space-x-2'>
          {!isCompact && (
            <Button
              variant='outline'
              size='sm'
              onClick={toggleFullScreen}
              className='mr-2'
            >
              {isFullScreen ? (
                <Minimize2 className='h-4 w-4' />
              ) : (
                <Maximize2 className='h-4 w-4' />
              )}
            </Button>
          )}
          {/* {(startPeriod && endPeriod) || (propStartPeriod && propEndPeriod) ? (
            <Button
              onClick={handleBack}
              className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs transition'
            >
              ← Back
            </Button>
          ) : null} */}
        </div>
      </div>
      <div className='flex-1 min-h-0 w-full'>
        {isLoading || isFetching ? (
          <div className='flex items-center justify-center h-full'>
            <div className='w-3/4 h-1/2 rounded-lg shimmer' />
          </div>
        ) : isDataReady ? (
          <Bar
            key={isFullWidth ? 'full' : 'half'}
            height={isFullScreen ? undefined : isCompact ? 250 : height}
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  bottom: isFullScreen ? 10 : isCompact ? 10 : 20,
                  top: isFullScreen ? 10 : isCompact ? 5 : 10,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  min: maxValue < 1_000_000_000 ? 100_000_000 : undefined,
                  grid: {
                    drawTicks: false,
                    color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`,
                  },
                  ticks: {
                    callback: (value: unknown) => {
                      const val = Number(value) / 1000000;
                      return `${val.toLocaleString('id-ID')}`;
                    },
                    font: {
                      size: isFullScreen ? 14 : 12,
                    },
                  },
                },
                x: {
                  title: { display: false, text: 'Month' },
                  ticks: {
                    callback: (value, index) => chartData.labels[index] ?? '',
                    font: {
                      size: isFullScreen ? 14 : 12,
                    },
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
                  labels: {
                    font: { size: isFullScreen ? 12 : 10 },
                  },
                },
                title: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      ` ${(context.raw as number).toLocaleString('id-ID')}`,
                  },
                  titleFont: { size: isFullScreen ? 14 : 12 },
                  bodyFont: { size: isFullScreen ? 12 : 10 },
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

export default MonthlySalesInvoiceChart;

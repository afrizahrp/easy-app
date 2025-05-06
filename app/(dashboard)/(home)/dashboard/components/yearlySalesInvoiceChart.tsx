'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useYearlySalesInvoice from '@/queryHooks/dashboard/sales/useYearlySalesInvoice';
import CustomTooltip from './customTooltip';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useMonthYearPeriodStore } from '@/store';

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
  const router = useRouter();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tooltipState, setTooltipState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    invoice: string;
    growth: number;
    year: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    invoice: '',
    growth: 0,
    year: '',
  });
  const { setSalesInvoicePeriod, setSalesPersonInvoicePeriod } =
    useMonthYearPeriodStore();

  // useEffect untuk menangani perubahan full-screen
  useEffect(() => {
    const handleFullscreenChange = () => {
      console.log('Fullscreen change triggered');
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

  // useEffect untuk menangani error toast
  useEffect(() => {
    if (error) {
      console.log('Error detected:', error);
      toast({
        description: 'Failed to load sales data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // useEffect untuk pembersihan tooltip saat unmount
  useEffect(() => {
    return () => {
      const tooltipEl = document.getElementById('chartjs-tooltip');
      if (tooltipEl) {
        tooltipEl.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (chartContainerRef.current) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [isFullScreen]);

  const toggleFullScreen = useCallback(() => {
    console.log('toggleFullScreen called');
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
    onModeChange?.(!isFullScreen);
  }, [isFullScreen, onModeChange]);

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return null;

    const sortedData = [...data].sort(
      (a, b) => Number(a.period) - Number(b.period)
    );
    const years = sortedData.map((d) => d.period);
    const colorPalette = generateYearColorPalette(years);

    return {
      labels: years,
      datasets: [
        {
          label: '',
          data: years.map((year) => {
            const yearData = sortedData.find((d) => d.period === year);
            return yearData ? yearData.totalInvoice / 1_000_000 : 0;
          }),
          backgroundColor: (
            ctx: import('chart.js').ScriptableContext<'bar'>
          ) => {
            const chart = ctx.chart;
            const { ctx: canvasCtx, chartArea } = chart;

            const year = years[ctx.dataIndex];
            const [from, to] = colorPalette[years.indexOf(year)] || [
              'hsl(220, 70%, 40%)',
              'hsl(220, 70%, 60%)',
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
          barThickness: isFullScreen ? 30 : 25,
          borderRadius: 10,
        },
      ],
    } as import('chart.js').ChartData<'bar', number[], string>;
  }, [data, isFullScreen]);

  const maxValue = React.useMemo(() => {
    if (!chartData) return 0;
    return Math.max(...chartData.datasets.flatMap((ds) => ds.data));
  }, [chartData]);

  const handleChartClick = useCallback(
    (
      event: import('chart.js').ChartEvent,
      elements: import('chart.js').ActiveElement[],
      chart: import('chart.js').Chart
    ) => {
      if (isCompact || elements.length === 0) return;

      const element = elements[0];
      const dataIndex = element.index;
      const year =
        chartData &&
        Array.isArray(chartData.labels) &&
        chartData.labels[dataIndex]
          ? chartData.labels[dataIndex]
          : undefined;

      if (year) {
        const yearNum = parseInt(year, 10);
        const startPeriod = new Date(yearNum, 0, 1); // 1 Januari
        const endPeriod = new Date(yearNum, 11, 31, 23, 59, 59, 999); // 31 Desember
        console.log('Updating salesInvoicePeriod:', { startPeriod, endPeriod });
        setSalesInvoicePeriod({ startPeriod, endPeriod });
        // setSalesPersonInvoicePeriod({ startPeriod, endPeriod });
        router.push('/analytics');
      }
    },
    [
      isCompact,
      chartData,
      router,
      setSalesInvoicePeriod,
      setSalesPersonInvoicePeriod,
    ]
  );

  // Logika tooltip dengan pembatasan pembaruan state
  const handleTooltip = useCallback(
    (context: {
      chart: import('chart.js').Chart;
      tooltip: import('chart.js').TooltipModel<'bar'>;
    }) => {
      console.log('handleTooltip called', {
        isFullScreen,
        tooltipOpacity: context.tooltip.opacity,
      });
      const { chart, tooltip } = context;
      if (!chartData || !chartData.labels) {
        if (tooltipState.visible) {
          setTooltipState((prev) => ({ ...prev, visible: false }));
        }
        return;
      }

      if (tooltip.opacity === 0) {
        if (tooltipState.visible) {
          setTooltipState((prev) => ({ ...prev, visible: false }));
        }
        return;
      }

      if (tooltip.body) {
        const year = chartData.labels[tooltip.dataPoints[0].dataIndex] ?? '';
        const yearData = data?.find((d) => d.period === year);
        const invoice = (tooltip.dataPoints[0].raw as number).toLocaleString(
          'id-ID'
        );
        const growth = yearData?.growthPercentage ?? 0;
        const canvasRect = chart.canvas.getBoundingClientRect();
        const x = canvasRect.left + tooltip.caretX + 10;
        const y = canvasRect.top + tooltip.caretY - 3;

        setTooltipState((prev) => {
          if (
            prev.visible === true &&
            prev.year === year &&
            prev.invoice === invoice &&
            prev.growth === growth &&
            prev.x === x &&
            prev.y === y
          ) {
            return prev;
          }
          console.log('Updating tooltip state:', {
            year,
            invoice,
            growth,
            x,
            y,
          });
          return { visible: true, x, y, invoice, growth, year };
        });
      }
    },
    [chartData, data, tooltipState.visible, isFullScreen]
  );
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
          Sales Invoice by Yearly (in Millions IDR)
        </h2>
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
      </div>

      <div className='flex-1 min-h-0 w-full'>
        {isLoading || isFetching ? (
          <div className='flex items-center justify-center h-full'>
            <div className='w-3/4 h-1/2 rounded-lg shimmer' />
          </div>
        ) : chartData ? (
          <>
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
                    grid: {
                      drawTicks: false,
                      color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`,
                    },
                    ticks: {
                      callback: (value: unknown) => {
                        const val = Number(value);
                        return `${val.toLocaleString('id-ID')}`;
                      },
                      font: {
                        size: isFullScreen ? 14 : 12,
                      },
                    },
                  },
                  x: {
                    title: { display: false, text: 'Year' },
                    ticks: {
                      callback: (_: unknown, index: number) =>
                        Array.isArray(chartData?.labels)
                          ? chartData.labels[index]
                          : '',
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
                    display: false,
                  },
                  title: {
                    display: false,
                  },
                  tooltip: {
                    enabled: false,
                    external: handleTooltip,
                  },
                },
                onClick: !isCompact ? handleChartClick : undefined,
              }}
            />
            <CustomTooltip
              visible={tooltipState.visible}
              x={tooltipState.x}
              y={tooltipState.y}
              invoice={tooltipState.invoice}
              growth={tooltipState.growth}
              isFullScreen={isFullScreen}
              parentRef={isFullScreen ? chartContainerRef : undefined}
            />
          </>
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

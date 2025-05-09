'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import useMonthlyComparisonSalesInvoice from '@/queryHooks/analytics/sales/useMonthlyComparisonSalesInvoice';
import CustomTooltip from '@/components/ui/customTooltip';
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

  const { data, isLoading, isFetching, error } =
    useMonthlyComparisonSalesInvoice({
      context: 'salesInvoice',
    });

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tooltipState, setTooltipState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    invoice: string;
    growth: number;
    month: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    invoice: '',
    growth: 0,
    month: '',
  });

  const toggleFullScreen = useCallback(() => {
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

  useEffect(() => {
    if (error) {
      toast({
        description:
          error.message || 'Failed to load sales data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

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

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return null;

    const allYears = data.map((d) => d.period);
    const colorPalette = generateYearColorPalette(allYears);

    const datasets = data.map((yearData, idx) => ({
      label: `Sales ${yearData.period}`,
      data: months.map(
        (month) => (yearData.months[month]?.amount || 0) / 1_000_000
      ),
      backgroundColor: (ctx: import('chart.js').ScriptableContext<'bar'>) => {
        const chart = ctx.chart;
        const { ctx: canvasCtx, chartArea } = chart;

        const [from, to] = colorPalette[idx % colorPalette.length] || [
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
      borderColor: colorPalette[idx % colorPalette.length][0],
      borderWidth: 1,
      barThickness: isFullScreen ? 30 : 25,
      borderRadius: 15,
      growthPercentages: months.map(
        (month) => yearData.months[month]?.growthPercentage || 0
      ),
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

  const handleTooltip = useCallback(
    (context: {
      chart: import('chart.js').Chart;
      tooltip: import('chart.js').TooltipModel<'bar'>;
    }) => {
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

      if (tooltip.dataPoints && tooltip.dataPoints.length > 0) {
        const dataIndex = tooltip.dataPoints[0].dataIndex;
        const datasetIndex = tooltip.dataPoints[0].datasetIndex;
        const month = chartData.labels[dataIndex] ?? '';
        const invoice = (
          (tooltip.dataPoints[0].raw as number) * 1_000_000
        ).toLocaleString('id-ID');
        const growth = (chartData.datasets[datasetIndex] as any)
          .growthPercentages[dataIndex];

        const canvasRect = chart.canvas.getBoundingClientRect();
        const x = canvasRect.left + tooltip.caretX + 10;
        const y = canvasRect.top + tooltip.caretY - 3;

        setTooltipState((prev) => {
          if (
            prev.visible === true &&
            prev.month === month &&
            prev.invoice === invoice &&
            prev.growth === growth &&
            prev.x === x &&
            prev.y === y
          ) {
            return prev;
          }
          return {
            visible: true,
            x,
            y,
            invoice,
            growth,
            month,
          };
        });
      }
    },
    [chartData, tooltipState.visible, isFullScreen]
  );

  const isDataReady =
    !!chartData &&
    Array.isArray(chartData.labels) &&
    chartData.labels.length > 0 &&
    Array.isArray(chartData.datasets) &&
    chartData.datasets.some(
      (ds) => Array.isArray(ds.data) && ds.data.some((value) => value > 0)
    );

  return (
    <motion.div
      ref={chartContainerRef}
      className={`chart-container ${isCompact ? 'compact' : ''} ${
        isFullScreen && !document.fullscreenElement
          ? 'fixed inset-0 z-50 bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-md'
          : 'relative bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm'
      } flex flex-col h-fit min-h-[250px] w-full box-border`}
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
          Monthly Sales (in Millions of IDR)
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
        ) : isDataReady ? (
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
                    bottom: isCompact ? 10 : 20,
                    top: isCompact ? 5 : 10,
                    left: 10,
                    right: 10,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawTicks: false,
                      color: `hsl(${
                        theme?.cssVars[mode === 'dark' ? 'dark' : 'light']
                          .chartGird
                      })`,
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
                    title: { display: false, text: 'Month' },
                    ticks: {
                      callback: (value, index) => chartData.labels[index] ?? '',
                      font: {
                        size: isFullScreen ? 14 : 12,
                      },
                      align: 'center',
                      crossAlign: 'center',
                      autoSkip: false,
                      maxRotation: 0,
                      minRotation: 0,
                      padding: 10,
                    },
                    grid: {
                      drawTicks: false,
                      color: `hsl(${
                        theme?.cssVars[mode === 'dark' ? 'dark' : 'light']
                          .chartGird
                      })`,
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
                    enabled: false,
                    external: handleTooltip,
                  },
                },
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
              isCompact={isCompact}
            />
          </>
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-gray-400'>
            <p className='text-sm font-medium'>No data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MonthlySalesInvoiceChart;

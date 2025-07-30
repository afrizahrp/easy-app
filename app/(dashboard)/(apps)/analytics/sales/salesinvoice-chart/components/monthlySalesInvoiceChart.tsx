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
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useMonthlyComparisonSalesInvoice from '@/queryHooks/analytics/sales/useMonthlyComparisonSalesInvoice';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

// Use 3-letter month names to match backend data format
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
    if (chartContainerRef.current) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [isFullScreen]);

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      console.log('🔍 [CHART DEBUG] No data available');
      return null;
    }

    // console.log('🔍 [CHART DEBUG] Raw data:', data);
    // console.log('🔍 [CHART DEBUG] Data length:', data.length);

    const allYears = data.map((d) => d.period);
    const colorPalette = generateYearColorPalette(allYears);

    // console.log('🔍 [CHART DEBUG] All years:', allYears);
    // console.log('🔍 [CHART DEBUG] First year data:', data[0]);
    // console.log('🔍 [CHART DEBUG] First year months:', data[0]?.months);

    const datasets = data.map((yearData, idx) => {
      // console.log(
      //   `🔍 [CHART DEBUG] Processing year ${yearData.period}:`,
      //   yearData
      // );

      const monthData = months.map((month) => {
        const monthValue = yearData.months[month];
        // Handle both direct number values and object with amount property
        const amount =
          typeof monthValue === 'number' ? monthValue : monthValue?.amount || 0;
        // console.log(
        //   `🔍 [CHART DEBUG] Month ${month}:`,
        //   monthValue,
        //   'Amount:',
        //   amount
        // );
        return amount / 1_000_000;
      });

      // console.log(
      //   `🔍 [CHART DEBUG] Processed data for ${yearData.period}:`,
      //   monthData
      // );

      return {
        label: `Sales ${yearData.period}`,
        data: monthData,
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
      };
    });

    // console.log('🔍 [CHART DEBUG] Final datasets:', datasets);

    return {
      labels: months,
      datasets,
    };
  }, [data, isFullScreen]);

  const isDataReady =
    !!chartData &&
    Array.isArray(chartData.labels) &&
    chartData.labels.length > 0 &&
    Array.isArray(chartData.datasets) &&
    chartData.datasets.some(
      (ds) => Array.isArray(ds.data) && ds.data.some((value) => value > 0)
    );

  // console.log('🔍 [CHART DEBUG] isDataReady:', isDataReady);
  // console.log('🔍 [CHART DEBUG] chartData:', chartData);
  // console.log('🔍 [CHART DEBUG] chartData?.labels:', chartData?.labels);
  // console.log('🔍 [CHART DEBUG] chartData?.datasets:', chartData?.datasets);

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
                  enabled: true,
                  position: 'nearest',
                  yAlign: 'top',
                  xAlign: 'left',

                  borderWidth: 1,
                  padding: 8,
                  bodyFont: { size: 12 },
                  callbacks: {
                    label: (context) => {
                      const amount = (context.raw as number) * 1_000_000;
                      const growth = (context.dataset as any).growthPercentages[
                        context.dataIndex
                      ];
                      const icon = growth > 0 ? '🔼' : growth < 0 ? '🔻' : '➖';

                      return [
                        `${amount.toLocaleString('id-ID')} ${icon} ${growth.toFixed(2)}%`,
                      ];
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-gray-400 p-12'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-24 h-24 mb-6 animate-bounce'
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
            <p className='text-sm font-medium mt-4'>No data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MonthlySalesInvoiceChart;

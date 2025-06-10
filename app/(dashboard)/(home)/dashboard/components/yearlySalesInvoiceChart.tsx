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
  ChartData,
  ChartDataset,
} from 'chart.js';
import { motion } from 'framer-motion';
import { hslToHex, generateYearColorPalette } from '@/lib/utils';
import {
  useMonthlyPeriodStore,
  useThemeStore,
  useYearlyPeriodStore,
} from '@/store';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useYearlySalesInvoice from '@/queryHooks/dashboard/sales/useYearlySalesInvoice';
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

// Custom dataset type to include growthPercentages
interface CustomBarDataset extends ChartDataset<'bar', number[]> {
  growthPercentages: number[];
}

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
  const { setSalesInvoicePeriod, setSalesPersonInvoicePeriod } =
    useMonthYearPeriodStore();
  const { selectedMonths } = useMonthlyPeriodStore();
  const { selectedYears } = useYearlyPeriodStore();

  // Handle fullscreen change
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

  // Handle error toast
  useEffect(() => {
    if (error) {
      toast({
        description: 'Failed to load sales data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Trigger resize on fullscreen change
  useEffect(() => {
    if (chartContainerRef.current) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [isFullScreen]);

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

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return null;

    const sortedData = [...data].sort(
      (a, b) => Number(a.period) - Number(b.period)
    );
    const years =
      selectedYears.length > 0
        ? selectedYears
        : sortedData.map((d) => d.period);
    const colorPalette = generateYearColorPalette(years);

    // Generate labels based on selectedMonths with proper capitalization
    const labels = years.map((year) => {
      if (selectedMonths.length > 1) {
        // Use the last selected month for "As-at" label
        const lastMonth = selectedMonths[selectedMonths.length - 1];
        const capitalizedMonth =
          lastMonth.charAt(0).toUpperCase() + lastMonth.slice(1);
        return `As-at ${capitalizedMonth} ${year}`;
      } else if (selectedMonths.length === 1) {
        // Use the single selected month
        const month = selectedMonths[0];
        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
        return `${capitalizedMonth} ${year}`;
      } else {
        // Fallback to year only if no months are selected
        return `${year}`;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Yearly Sales',
          data: labels.map((label) => {
            const year = label.match(/\d{4}/)?.[0]; // Extract year from label
            const yearData = sortedData.find((d) => d.period === year);
            return yearData ? yearData.totalInvoice / 1_000_000_000 : 0; // Convert to billions
          }),
          backgroundColor: (
            ctx: import('chart.js').ScriptableContext<'bar'>
          ) => {
            const chart = ctx.chart;
            const { ctx: canvasCtx, chartArea } = chart;

            const label = labels[ctx.dataIndex];
            const year = label.match(/\d{4}/)?.[0];
            const yearIndex = years.indexOf(year ?? '');
            const [from, to] = colorPalette[yearIndex] || [
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
          categoryPercentage: 0.8,
          barPercentage: 0.8,
          growthPercentages: labels.map((label) => {
            const year = label.match(/\d{4}/)?.[0];
            const yearData = sortedData.find((d) => d.period === year);
            return yearData ? yearData.growthPercentage : 0;
          }),
        },
      ] as CustomBarDataset[],
    } as ChartData<'bar', number[], string>;
  }, [data, isFullScreen, selectedMonths, selectedYears]);

  const handleChartClick = useCallback(
    (
      event: import('chart.js').ChartEvent,
      elements: import('chart.js').ActiveElement[],
      chart: import('chart.js').Chart
    ) => {
      if (elements.length === 0) return;

      const element = elements[0];
      const dataIndex = element.index;
      const label =
        chartData &&
        Array.isArray(chartData.labels) &&
        chartData.labels[dataIndex]
          ? chartData.labels[dataIndex]
          : undefined;

      if (label) {
        const year = label.match(/\d{4}/)?.[0]; // Extract year from label
        if (year) {
          const yearNum = parseInt(year, 10);
          const startPeriod = new Date(yearNum, 0, 1); // 1 Januari
          const endPeriod = new Date(yearNum, 11, 31, 23, 59, 59, 999); // 31 Desember
          setSalesInvoicePeriod({ startPeriod, endPeriod });
          router.push('/analytics/sales/salesinvoice-chart');
        }
      }
    },
    [chartData, router, setSalesInvoicePeriod]
  );

  const isDataReady =
    !!chartData &&
    Array.isArray(chartData.labels) &&
    chartData.labels.length > 0 &&
    Array.isArray(chartData.datasets) &&
    chartData.datasets.some(
      (ds) => Array.isArray(ds.data) && ds.data.some((value) => value > 0)
    );

  // Check if selectedMonths are consecutive
  const isConsecutiveMonths = React.useMemo(() => {
    if (selectedMonths.length <= 1) return false;
    const monthOrder = [
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
    const sortedMonths = [...selectedMonths].sort(
      (a, b) =>
        monthOrder.indexOf(
          a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
        ) -
        monthOrder.indexOf(b.charAt(0).toUpperCase() + b.slice(1).toLowerCase())
    );
    for (let i = 0; i < sortedMonths.length - 1; i++) {
      const currentIndex = monthOrder.indexOf(
        sortedMonths[i].charAt(0).toUpperCase() +
          sortedMonths[i].slice(1).toLowerCase()
      );
      const nextIndex = monthOrder.indexOf(
        sortedMonths[i + 1].charAt(0).toUpperCase() +
          sortedMonths[i + 1].slice(1).toLowerCase()
      );
      if (nextIndex !== currentIndex + 1) {
        return false;
      }
    }
    return true;
  }, [selectedMonths]);

  // Dynamic title based on selectedMonths
  const title = React.useMemo(() => {
    if (selectedMonths.length > 1) {
      if (isConsecutiveMonths) {
        // Use the last month for consecutive months
        const lastMonth = selectedMonths[selectedMonths.length - 1];
        const capitalizedMonth =
          lastMonth.charAt(0).toUpperCase() + lastMonth.slice(1);
        return `Yearly Sales Performance as at ${capitalizedMonth} (in IDR Billion)`;
      } else {
        // List all months with "and" for non-consecutive
        const capitalizedMonths = selectedMonths.map(
          (m) => m.charAt(0).toUpperCase() + m.slice(1)
        );
        const lastMonth = capitalizedMonths.pop();
        const formattedMonths =
          capitalizedMonths.length > 0
            ? `${capitalizedMonths.join(', ')} and ${lastMonth}`
            : lastMonth;
        return `Yearly Sales Performance for ${formattedMonths} (in IDR Billion)`;
      }
    } else if (selectedMonths.length === 1) {
      // Single month
      const month = selectedMonths[0];
      const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
      return `Yearly Sales Performance for ${capitalizedMonth} (in IDR Billion)`;
    } else {
      // No months selected
      return 'Yearly Sales Performance (in IDR Billion)';
    }
  }, [selectedMonths, isConsecutiveMonths]);

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
          {title}
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
            height={isFullScreen ? undefined : isCompact ? 400 : height}
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
                  display: false,
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
                  bodyFont: { size: isFullScreen ? 16 : 14 },
                  callbacks: {
                    label: (context) => {
                      const amount = (context.raw as number) * 1_000_000_000; // Convert back to IDR
                      const growth = (context.dataset as CustomBarDataset)
                        .growthPercentages[context.dataIndex];
                      const icon = growth > 0 ? '🔼' : growth < 0 ? '🔻' : '➖';
                      return [
                        `${amount.toLocaleString('id-ID')} ${icon} ${growth}%`,
                      ];
                    },
                  },
                },
              },
              onClick: !isCompact ? handleChartClick : undefined,
              onHover: (event, chartElements) => {
                if (event.native && (event.native.target as HTMLElement)) {
                  if (!isCompact && chartElements.length > 0) {
                    (event.native.target as HTMLElement).style.cursor =
                      'pointer';
                  } else {
                    (event.native.target as HTMLElement).style.cursor =
                      'default';
                  }
                }
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

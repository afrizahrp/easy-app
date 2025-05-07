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
  ScriptableContext,
} from 'chart.js';
import { hslToHex } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useMonthlySalesPersonInvoice from '@/queryHooks/analytics/sales/useMonthlySalesPersonInvoice';
import {
  salesPersonColorMap,
  getFallbackColor,
} from '@/utils/salesPersonColorMap';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { months } from '@/utils/monthNameMap';
import { getSalesPersonColor } from '@/utils/getSalesPersonColor';
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

interface SalesDataWithoutFilter {
  period: string;
  totalInvoice: number;
  months: {
    month: string;
    sales: { salesPersonName: string; amount: number }[];
  }[];
}

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
  color?: string;
}

interface MonthlySalesPersonInvoiceProps {
  height?: number;
  isCompact?: boolean;
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (selection: SalesPersonSelection | null) => void;
}

const MonthlySalesPersonInvoiceChart: React.FC<
  MonthlySalesPersonInvoiceProps
> = ({
  height = 400,
  isCompact = false,
  isFullWidth = true,
  onModeChange,
  onSalesPersonSelect,
}) => {
  const { theme: config, setTheme: setConfig } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const hslBackground = `hsla(${
    theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].background
  })`;
  const hexBackground = hslToHex(hslBackground);
  const { toast } = useToast();
  const { data, isLoading, isFetching, error } = useMonthlySalesPersonInvoice({
    context: 'salesPersonInvoice',
  });
  const { salesPersonInvoiceFilters, setSalesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore((state) => ({
      salesPersonInvoiceFilters: state.salesPersonInvoiceFilters,
      setSalesPersonInvoiceFilters: state.setSalesPersonInvoiceFilters,
    }));
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = () => {
    if (!chartContainerRef.current) return;

    if (!isFullScreen) {
      // Masuk full-screen
      const requestFullscreen =
        chartContainerRef.current.requestFullscreen ||
        (chartContainerRef.current as any).webkitRequestFullscreen ||
        (chartContainerRef.current as any).mozRequestFullScreen ||
        (chartContainerRef.current as any).msRequestFullscreen;

      if (requestFullscreen) {
        requestFullscreen.call(chartContainerRef.current);
      } else {
        // Fallback: Gunakan CSS full-screen
        setIsFullScreen(true);
      }
    } else {
      // Keluar full-screen
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
        // Fallback: Nonaktifkan CSS full-screen
        setIsFullScreen(false);
      }
    }
  };

  // Sinkronkan state dengan Fullscreen API
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
    if (!data || !data.length) return null;

    const allSalesPersons = Array.from(
      new Set(
        (data as SalesDataWithoutFilter[])
          .flatMap((d) => d.months)
          .flatMap((m) => m.sales.map((s) => s.salesPersonName))
      )
    );

    const datasets = allSalesPersons.map((salesPersonName) => {
      const color =
        salesPersonColorMap[salesPersonName.toLowerCase()] ||
        getFallbackColor(salesPersonName);

      return {
        label: salesPersonName,
        data: months.map((month) => {
          let totalAmount = 0;
          (data as SalesDataWithoutFilter[]).forEach((yearData) => {
            const monthData = yearData.months.find((m) => m.month === month);
            if (monthData) {
              const salesPersonData = monthData.sales.find(
                (s) => s.salesPersonName === salesPersonName
              );
              if (salesPersonData) {
                totalAmount += salesPersonData.amount;
              }
            }
          });
          return totalAmount;
        }),
        backgroundColor: (ctx: ScriptableContext<'bar'>) => {
          const { chartArea, ctx: canvasCtx } = ctx.chart;
          if (!chartArea) return color.to;
          const gradient = canvasCtx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, color.from);
          gradient.addColorStop(1, color.to);
          return gradient;
        },
        borderColor: color.border,
        borderWidth: 1,
        maxBarThickness: isFullScreen ? 30 : 20, // Bar lebih lebar di full-screen
        borderRadius: 15,
        period: data && data.length > 0 ? data[0].period : undefined,
      };
    });

    return { labels: months, datasets };
  }, [data, isFullScreen]);

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

  const handleChartClick = (event: any, elements: any[]) => {
    if (isCompact || elements.length === 0) return;

    const element = elements[0];
    const datasetIndex = element.datasetIndex;
    const monthIndex = element.index;
    const salesPersonName = chartData?.datasets[datasetIndex]?.label;
    const year = chartData?.datasets[datasetIndex]?.period;
    const month = chartData?.labels[monthIndex] as string;

    if (salesPersonName) {
      setSalesPersonInvoiceFilters({ salesPersonName: [salesPersonName] });
      const colorObj = getSalesPersonColor(salesPersonName);
      const color = typeof colorObj === 'string' ? colorObj : colorObj?.to;
      onSalesPersonSelect?.({ salesPersonName, year, month, color });
    }
  };

  return (
    <div
      ref={chartContainerRef}
      className={`chart-container ${isCompact ? 'compact' : ''} ${
        isFullScreen && !document.fullscreenElement
          ? 'fixed inset-0 z-50 bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-md'
          : 'relative rounded-lg shadow-md'
      } flex flex-col h-fit min-h-0`}
      style={{ backgroundColor: hexBackground }}
    >
      <div className='relative flex items-center justify-between mb-2'>
        <h2 className='text-sm text-muted-foreground font-semibold ml-2'>
          Monthly Sales Over 300 Million IDR by Salesperson
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
      <div className='flex-1 min-h-0'>
        {isLoading || isFetching ? (
          <div className='flex items-center justify-center h-full'>
            <div className='w-3/4 h-1/2 rounded-lg shimmer' />
          </div>
        ) : isDataReady ? (
          <Bar
            height={isFullScreen ? undefined : isCompact ? 300 : height}
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  bottom: isFullScreen ? 10 : isCompact ? 5 : 10,
                  top: isFullScreen ? 10 : isCompact ? 5 : 10,
                  left: 0,
                  right: 0,
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
                      size: isFullScreen ? 14 : 12, // Font lebih besar di full-screen
                    },
                  },
                },
                x: {
                  title: { display: false, text: 'Month' },
                  // offset: 5, // Jarak kecil antar bulan
                  grid: {
                    drawTicks: false,
                    color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`,
                    display: false,
                  },
                  ticks: {
                    autoSkip: false,
                    callback: (value, index, ticks) => {
                      return chartData.labels[index] ?? '';
                    },
                    font: {
                      size: isFullScreen ? 14 : 12, // Font lebih besar di full-screen
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  display: !isCompact,
                  position: 'top',
                  labels: {
                    color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartLabel})`,
                    boxWidth: 8,
                    font: { size: isFullScreen ? 12 : 10 },
                    usePointStyle: true,
                    pointStyle: 'circle',
                  },
                  maxHeight: isFullScreen ? 80 : 60,
                },
                title: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${context.dataset.label}: ${(context.raw as number).toLocaleString('id-ID')}`,
                  },
                  titleFont: { size: isFullScreen ? 14 : 12 },
                  bodyFont: { size: isFullScreen ? 12 : 10 },
                },
              },
              datasets: {
                bar: {
                  barThickness: isFullScreen ? 30 : 20, // Lebar bar lebih besar di full-screen
                  categoryPercentage: 0.95, // Minimalkan gap antar bulan
                  barPercentage: 0.85, // Lebar bar dalam kategori
                },
              },

              onClick: !isCompact ? handleChartClick : undefined,
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

export default MonthlySalesPersonInvoiceChart;

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
  ScriptableContext,
} from 'chart.js';
import { motion } from 'framer-motion';
import { hslToHex } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useYearlySalesPersonInvoice from '@/queryHooks/dashboard/sales/useYearlySalesPersonInvoice';
import CustomTooltip from '@/components/ui/customTooltip';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useMonthYearPeriodStore } from '@/store';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { getSalesPersonColor } from '@/utils/getSalesPersonColor';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

interface SalesPerson {
  salesPersonName: string;
  amount: number;
  quantity: number;
  growthPercentage: number;
}

interface SalesData {
  period: string;
  totalInvoice: number;
  sales: SalesPerson[];
}

interface YearlySalesPersonInvoiceChartProps {
  height?: number;
  isCompact?: boolean;
  isFullWidth?: boolean;
  onModeChange?: (isFull: boolean) => void;
  years?: number[];
}

const YearlySalesPersonInvoiceChart: React.FC<
  YearlySalesPersonInvoiceChartProps
> = ({
  height = 400,
  isCompact = false,
  isFullWidth = true,
  onModeChange,
  years,
}) => {
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const hslBackground = `hsla(${
    theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].background
  })`;
  const hexBackground = hslToHex(hslBackground);
  const { toast } = useToast();
  const { data, isLoading, isFetching, error } = useYearlySalesPersonInvoice({
    context: 'salesPersonInvoice',
  });
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
    salesPersonName: string;
    quantity: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    invoice: '',
    growth: 0,
    year: '',
    salesPersonName: '',
    quantity: 0,
  });
  const { setSalesPersonInvoicePeriod } = useMonthYearPeriodStore();
  const { setSalesPersonInvoiceFilters } = useSalesInvoiceHdFilterStore();

  console.log('Sales Person Invoice Data:', data);

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

  useEffect(() => {
    if (error) {
      console.log('Error detected:', error);
      toast({
        description: 'Failed to load sales data. Please try again.',
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
      console.log('Chart Container Dimensions:', {
        width: chartContainerRef.current.offsetWidth,
        height: chartContainerRef.current.offsetHeight,
      });
      window.dispatchEvent(new Event('resize'));
    }
  }, [isFullScreen, isFullWidth]);

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
    if (!data || data.length === 0) {
      console.log('No data available');
      return null;
    }

    const sortedData = [...data].sort(
      (a, b) => Number(a.period) - Number(b.period)
    );
    const years = sortedData.map((d) => d.period);
    const allSalesPersons = Array.from(
      new Set(sortedData.flatMap((d) => d.sales.map((s) => s.salesPersonName)))
    );

    console.log('Years:', years);
    console.log('SalesPersons:', allSalesPersons);

    const datasets = allSalesPersons.map((salesPersonName) => {
      const colorConfig = getSalesPersonColor(salesPersonName) || {
        from: 'hsl(220, 70%, 50%)',
        to: 'hsl(220, 70%, 70%)',
        border: 'hsl(220, 70%, 50%)',
      };

      const dataValues = years.map((year) => {
        const yearData = sortedData.find((d) => d.period === year);
        const salesPersonData = yearData?.sales.find(
          (s) => s.salesPersonName === salesPersonName
        );
        return salesPersonData ? salesPersonData.amount / 1_000_000 : 0;
      });

      return {
        label: salesPersonName,
        data: dataValues,
        backgroundColor: (ctx: ScriptableContext<'bar'>) => {
          const { chartArea, ctx: canvasCtx } = ctx.chart;
          if (!chartArea) return colorConfig.from;
          const gradient = canvasCtx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, colorConfig.from);
          gradient.addColorStop(1, colorConfig.to);
          return gradient;
        },
        borderColor: colorConfig.border,
        borderWidth: 1,
        maxBarThickness: isFullScreen ? 30 : 20,
        borderRadius: 15,
      };
    });

    console.log('Datasets:', datasets); // Debugging datasets

    const chartDataResult = {
      labels: years.length > 0 ? years : [''],
      datasets,
    };
    return chartDataResult as import('chart.js').ChartData<
      'bar',
      number[],
      string
    >;
  }, [data, isFullScreen]);

  const maxValue = React.useMemo(() => {
    if (!chartData) return 0;
    const max = Math.max(...chartData.datasets.flatMap((ds) => ds.data));
    console.log('maxValue:', max);
    return max;
  }, [chartData]);

  const handleChartClick = useCallback(
    (
      event: import('chart.js').ChartEvent,
      elements: import('chart.js').ActiveElement[],
      chart: import('chart.js').Chart
    ) => {
      if (elements.length === 0 || !chartData || !chartData.labels) return;

      const element = elements[0];
      const datasetIndex = element.datasetIndex;
      const dataIndex = element.index;
      const salesPersonName = chartData.datasets[datasetIndex]?.label;
      const year = chartData.labels[dataIndex];

      if (salesPersonName && year) {
        const yearNum = parseInt(year, 10);
        const startPeriod = new Date(yearNum, 0, 1);
        const endPeriod = new Date(yearNum, 11, 31, 23, 59, 59, 999);
        setSalesPersonInvoicePeriod({ startPeriod, endPeriod });
        setSalesPersonInvoiceFilters({ salesPersonName: [salesPersonName] });
        router.push('/analytics/sales/salespersonperforma-chart');
      }
    },
    [
      chartData,
      router,
      setSalesPersonInvoicePeriod,
      setSalesPersonInvoiceFilters,
    ]
  );

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
        const datasetIndex = tooltip.dataPoints[0].datasetIndex;
        const dataIndex = tooltip.dataPoints[0].dataIndex;
        const salesPersonName = chartData.datasets[datasetIndex].label ?? '';
        const year = chartData.labels[dataIndex] ?? '';
        const yearData = data?.find((d) => d.period === year);
        const salesPersonData = yearData?.sales.find(
          (s) => s.salesPersonName === salesPersonName
        );
        const invoice = (tooltip.dataPoints[0].raw as number).toLocaleString(
          'id-ID'
        );
        const growth = salesPersonData?.growthPercentage ?? 0;
        const quantity = salesPersonData?.quantity ?? 0;
        const canvasRect = chart.canvas.getBoundingClientRect();
        const x = canvasRect.left + tooltip.caretX + 10;
        const y = canvasRect.top + tooltip.caretY - 3;

        setTooltipState((prev) => {
          if (
            prev.visible === true &&
            prev.year === year &&
            prev.invoice === invoice &&
            prev.growth === growth &&
            prev.quantity === quantity &&
            prev.salesPersonName === salesPersonName &&
            prev.x === x &&
            prev.y === y
          ) {
            return prev;
          }
          console.log('Updating tooltip state:', {
            year,
            invoice,
            growth,
            quantity,
            salesPersonName,
            x,
            y,
          });
          return {
            visible: true,
            x,
            y,
            invoice,
            growth,
            year,
            salesPersonName,
            quantity,
          };
        });
      }
    },
    [chartData, data, tooltipState.visible, isFullScreen]
  );

  return (
    <div
      ref={chartContainerRef}
      className={`chart-container ${isCompact ? 'compact' : ''} ${
        isFullScreen && !document.fullscreenElement
          ? 'fixed inset-0 z-50 bg-white dark:bg-[#18181b] p-2 rounded-lg shadow-md'
          : 'relative rounded-lg shadow-md'
      } flex flex-col h-fit min-h-0 w-full overflow-x-auto max-w-full`}
      style={{ backgroundColor: hexBackground }}
    >
      <div className='relative flex items-center justify-between mb-2 px-2'>
        <h2 className='text-sm text-muted-foreground font-semibold'>
          Yearly Sales Above 3.6 Billion IDR by Salesperson
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
        ) : chartData ? (
          <>
            <Bar
              key={isFullWidth ? 'full' : 'half'}
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
                  x: {
                    title: { display: false, text: 'Year' },
                    grid: {
                      drawTicks: false,
                      display: false,
                    },
                    ticks: {
                      font: { size: isFullScreen ? 14 : 12 },
                      autoSkip: false,
                      callback: (value, index) => {
                        return chartData && chartData.labels
                          ? (chartData.labels[index] ?? '')
                          : '';
                      },
                    },
                  },
                  y: {
                    beginAtZero: true,
                    min: 0, // Mulai dari 0 untuk memastikan bar terlihat
                    max: maxValue > 0 ? maxValue * 1.2 : 1000, // Kurangi faktor max menjadi 1.2
                    grid: {
                      drawTicks: false,
                      color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`,
                    },
                    ticks: {
                      callback: (value: unknown) => {
                        const val = Number(value);
                        return `${val.toLocaleString('id-ID')}M`; // Tambahkan 'M' untuk jutaan
                      },
                      font: { size: isFullScreen ? 14 : 12 },
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
                    enabled: false,
                    external: handleTooltip,
                    callbacks: {
                      label: (context) =>
                        `${context.dataset.label}: ${(context.raw as number).toLocaleString('id-ID')}M`,
                    },
                    titleFont: { size: isFullScreen ? 14 : 12 },
                    bodyFont: { size: isFullScreen ? 12 : 10 },
                  },
                },
                datasets: {
                  bar: {
                    barThickness: isFullScreen ? 30 : 20,
                    categoryPercentage: 0.9, // Sesuaikan untuk single label
                    barPercentage: 0.8, // Sesuaikan untuk single label
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
                d='M3 3v18h8m-8-4h8m-8-4h8'
              />
            </svg>
            <p className='text-sm font-medium'>No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YearlySalesPersonInvoiceChart;

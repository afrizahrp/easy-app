'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Bar, Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScriptableContext,
  ChartData,
  TooltipModel,
} from 'chart.js';
import { hslToHex } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useMonthlyComparisonSalesPersonInvoiceFiltered from '@/queryHooks/analytics/sales/useMonthlyComparissonSalesPersonInvoiceFiltered';
import { Skeleton } from '@/components/ui/skeleton';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { months } from '@/utils/monthNameMap';
import { getSalesPersonColor } from '@/utils/getSalesPersonColor';
import CustomTooltip from '@/components/ui/customTooltip';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

interface MonthlyData {
  amount: number;
  growthPercentage: number | null;
}

interface SalesPersonInvoiceComparisonData {
  period: string;
  totalInvoice: number;
  salesPersonName: string;
  months: { [month: string]: MonthlyData };
}

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
}

interface MonthlySalesPersonInvoiceChartProps {
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (selection: SalesPersonSelection | null) => void;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  invoice: string;
  growth: number;
}

const MonthlySalesPersonInvoiceChart: React.FC<
  MonthlySalesPersonInvoiceChartProps
> = ({ isFullWidth = true, onModeChange, onSalesPersonSelect }) => {
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const hslBackground = `hsla(${
    theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].background
  })`;
  const hexBackground = hslToHex(hslBackground);
  const { toast } = useToast();

  const { salesPersonInvoiceFilters, setSalesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore((state) => ({
      salesPersonInvoiceFilters: state.salesPersonInvoiceFilters,
      setSalesPersonInvoiceFilters: state.setSalesPersonInvoiceFilters,
    }));

  const validSalesPersonNames = Array.isArray(
    salesPersonInvoiceFilters.salesPersonName
  )
    ? salesPersonInvoiceFilters.salesPersonName.filter(
        (name) => typeof name === 'string' && name.trim()
      )
    : salesPersonInvoiceFilters.salesPersonName &&
        typeof salesPersonInvoiceFilters.salesPersonName === 'string' &&
        salesPersonInvoiceFilters.salesPersonName
      ? [salesPersonInvoiceFilters.salesPersonName]
      : [];

  const { data, isLoading, isFetching, error } =
    useMonthlyComparisonSalesPersonInvoiceFiltered({
      context: 'salesPersonInvoice',
      salesPersonNames: validSalesPersonNames,
    });

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const tooltipDataRef = useRef<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    invoice: '',
    growth: 0,
  });

  const [tooltipState, setTooltipState] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    invoice: '',
    growth: 0,
  });

  const chartData = React.useMemo(() => {
    if (!data || !data.length) return null;

    const datasets = data.map((entry: SalesPersonInvoiceComparisonData) => {
      const monthsData = entry.months || {};
      const color = getSalesPersonColor(entry.salesPersonName);

      return {
        label: entry.salesPersonName,
        data: months.map(
          (month) => (monthsData[month]?.amount || 0) / 1_000_000
        ),
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
        barThickness: 25,
        borderRadius: 15,
        period: entry.period,
        growthPercentages: months.map(
          (month) => monthsData[month]?.growthPercentage || 0
        ),
      };
    });

    return { labels: months, datasets };
  }, [data]);

  const customTooltipHandler = useCallback(
    (context: { chart: ChartJS<'bar'>; tooltip: TooltipModel<'bar'> }) => {
      const { chart, tooltip } = context;
      const container = containerRef.current;

      if (!container || !chartData) return;

      if (tooltip.opacity === 0) {
        if (tooltipDataRef.current.visible) {
          tooltipDataRef.current.visible = false;
          setTooltipState((prev) => ({ ...prev, visible: false }));
        }
        return;
      }

      const dataIndex = tooltip.dataPoints[0].dataIndex;
      const datasetIndex = tooltip.dataPoints[0].datasetIndex;
      const amount =
        (chartData.datasets[datasetIndex].data[dataIndex] as number) *
        1_000_000;
      const growth = (chartData.datasets[datasetIndex] as any)
        .growthPercentages[dataIndex];

      const position = chart.canvas.getBoundingClientRect();
      const bar = chart.getDatasetMeta(datasetIndex).data[dataIndex] as any;

      // Hitung posisi tooltip relatif terhadap bar
      const x =
        bar.x - position.left + container.scrollLeft + bar.width / 2 + 5; // Kanan bar
      const y = bar.y - position.top + container.scrollTop - 30; // Atas bar

      // Batasi posisi tooltip agar tidak keluar container
      const containerRect = container.getBoundingClientRect();
      const tooltipWidth = 150; // Estimasi lebar tooltip
      const tooltipHeight = 50; // Estimasi tinggi tooltip
      const adjustedX = Math.min(
        x,
        containerRect.width - tooltipWidth - 10 // Tidak keluar kanan
      );
      const adjustedY = Math.max(y, 10); // Tidak keluar atas

      const newTooltipData: TooltipState = {
        visible: true,
        x: adjustedX,
        y: adjustedY,
        invoice: amount.toLocaleString('id-ID') + ' IDR',
        growth,
      };

      if (
        tooltipDataRef.current.visible !== newTooltipData.visible ||
        tooltipDataRef.current.x !== newTooltipData.x ||
        tooltipDataRef.current.y !== newTooltipData.y ||
        tooltipDataRef.current.invoice !== newTooltipData.invoice ||
        tooltipDataRef.current.growth !== newTooltipData.growth
      ) {
        tooltipDataRef.current = newTooltipData;
        setTooltipState(newTooltipData);
      }
    },
    [chartData]
  );

  const handleChartClick = (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const element = elements[0];
      const datasetIndex = element.datasetIndex;
      const monthIndex = element.index;
      const salesPersonName = chartData?.datasets[datasetIndex]?.label;
      const year =
        chartData?.datasets[datasetIndex]?.period.match(/\d{4}/)?.[0] || '2025';
      const rawMonth = chartData?.labels[monthIndex] as string;
      const month = rawMonth
        ? rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1).toLowerCase()
        : undefined;

      if (salesPersonName && year && month) {
        onSalesPersonSelect?.({ salesPersonName, year, month });
        onModeChange?.(false);
      }
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        description:
          error.message ||
          'Failed to load sales by salesperson data. Please try again.',
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
    <div
      ref={containerRef}
      className={`bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm h-96 w-full relative`}
      style={{ backgroundColor: hexBackground }}
    >
      <div className='flex flex-row items-center justify-between mb-2'>
        <h2 className='text-md font-semibold text-muted-foreground'>
          {validSalesPersonNames.length === 1
            ? `Sales Performance by ${validSalesPersonNames[0]} (in Millions IDR)`
            : validSalesPersonNames.length === 2
              ? `Sales Performance by ${validSalesPersonNames.join(' and ')} (in Millions IDR)`
              : validSalesPersonNames.length > 2
                ? `Sales Performance by ${validSalesPersonNames
                    .slice(0, validSalesPersonNames.length - 1)
                    .join(', ')} and ${
                    validSalesPersonNames[validSalesPersonNames.length - 1]
                  } (in Millions IDR)`
                : 'Sales Performance (in Millions IDR)'}
        </h2>
        <div className='flex flex-col items-end space-y-2'>
          <button
            onClick={() => {
              setSalesPersonInvoiceFilters({
                salesPersonName: [],
              });
              onSalesPersonSelect?.(null);
              onModeChange?.(true);
            }}
            className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs transition'
          >
            ← All Salesperson
          </button>
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='w-full'>
          {isLoading || isFetching ? (
            <div className='flex items-center justify-center h-80'>
              <Skeleton className='w-3/4 h-1/2 rounded-lg' />
            </div>
          ) : isDataReady ? (
            <div className='h-80 w-full relative'>
              <Bar
                ref={chartRef}
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  layout: {
                    padding: { bottom: 20 },
                  },
                  scales: {
                    y: {
                      grid: {
                        drawTicks: false,
                        color: `hsl(${
                          theme?.cssVars[mode === 'dark' ? 'dark' : 'light']
                            .chartGird
                        })`,
                      },
                      ticks: {
                        callback: (value) =>
                          `${Number(value).toLocaleString('id-ID')}`,
                      },
                    },
                    x: {
                      grid: {
                        drawTicks: false,
                        color: `hsl(${
                          theme?.cssVars[mode === 'dark' ? 'dark' : 'light']
                            .chartGird
                        })`,
                        display: false,
                      },
                      ticks: {
                        color: `hsl(${
                          theme?.cssVars[mode === 'dark' ? 'dark' : 'light']
                            .chartLabel
                        })`,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: `hsl(${
                          theme?.cssVars[mode === 'dark' ? 'dark' : 'light']
                            .chartLabel
                        })`,
                        usePointStyle: true,
                        pointStyle: 'circle',
                      },
                    },
                    tooltip: {
                      enabled: false,
                      external: customTooltipHandler,
                    },
                  },
                  onClick: handleChartClick,
                  // Tambahkan onHover untuk mengatur kursor
                  onHover: (event, chartElements) => {
                    if (event.native && (event.native.target as HTMLElement)) {
                      if (chartElements.length > 0) {
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
                isFullScreen={false}
                parentRef={containerRef}
                isCompact={false}
              />
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-80 text-gray-400'>
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
    </div>
  );
};

export default MonthlySalesPersonInvoiceChart;

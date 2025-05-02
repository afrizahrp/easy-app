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
  ScriptableContext,
} from 'chart.js';
import { hslToHex } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useSalesByPeriodUnfiltered from '@/queryHooks/sls/analytics/useSalesPersonByPeriodUnFiltered';
import {
  salesPersonColorMap,
  getFallbackColor,
} from '@/utils/salesPersonColorMap';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { months } from '@/utils/monthNameMap';
import { getSalesPersonColor } from '@/utils/getSalesPersonColor';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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

interface SalesBySalesPersonUnFilteredProps {
  height?: number;
  isCompact?: boolean;
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (selection: SalesPersonSelection | null) => void;
}

const SalesBySalesPersonUnFilteredChart: React.FC<
  SalesBySalesPersonUnFilteredProps
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
  const { data, isLoading, isFetching, error } = useSalesByPeriodUnfiltered();
  const { salesPersonName, setSalesPersonName } = useSalesInvoiceHdFilterStore(
    (state) => ({
      salesPersonName: state.salesPersonName,
      setSalesPersonName: state.setSalesPersonName,
    })
  );

  // console.log('UnfilteredChart-isCompact', isCompact);

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
        barThickness: 25,
        borderRadius: 15,
        period: data && data.length > 0 ? data[0].period : undefined,
      };
    });

    return { labels: months, datasets };
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

  const handleChartClick = (event: any, elements: any[]) => {
    if (isCompact) return; // <-- Tambahkan ini

    if (elements.length > 0) {
      const element = elements[0];
      const datasetIndex = element.datasetIndex;
      const monthIndex = element.index;
      const salesPersonName = chartData?.datasets[datasetIndex]?.label;
      const year = chartData?.datasets[datasetIndex]?.period;
      const month = chartData?.labels[monthIndex] as string;

      if (salesPersonName) {
        setSalesPersonName([salesPersonName]);
        const colorObj = getSalesPersonColor(salesPersonName);
        const color = typeof colorObj === 'string' ? colorObj : colorObj?.to;
        onSalesPersonSelect?.({ salesPersonName, year, month, color });
      }
    }
  };

  return (
    <div
      className={`chart-container ${isCompact ? 'compact' : ''} bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm flex flex-col h-fit min-h-0`}
      style={{ backgroundColor: hexBackground }}
    >
      <div className='relative flex items-center mb-2'>
        <h2 className='text-sm text-muted-foreground font-semibold ml-2'>
          Top 5 Sales Performers (Above 100 Million IDR)
        </h2>
        {/* <div className='absolute right-0 top-0 flex items-center space-x-2'>
          <Label htmlFor='chart-mode-period'>
            {isFullWidth ? 'Full Width' : 'Half Width'}
          </Label>
          <Switch
            id='chart-mode-period'
            checked={isFullWidth}
            onCheckedChange={(checked) => onModeChange?.(checked)}
            aria-label='Toggle full width chart'
          />
        </div> */}
      </div>
      <div className='flex-1 min-h-0'>
        {isLoading || isFetching ? (
          <div className='flex items-center justify-center h-full'>
            <div className='w-3/4 h-1/2 rounded-lg shimmer' />
          </div>
        ) : isDataReady ? (
          <Bar
            width={isFullWidth ? 600 : 300}
            height={isCompact ? 300 : height}
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
                  },
                },
                x: {
                  title: { display: false, text: 'Month' },
                  grid: {
                    drawTicks: false,
                    color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`,
                    display: false,
                  },
                  ticks: {
                    callback: (value, index, ticks) => {
                      return chartData.labels[index] ?? '';
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  display: !isCompact,
                  position: 'top',
                  labels: {
                    color: `hsl(${
                      theme?.cssVars[mode === 'dark' ? 'dark' : 'light']
                        .chartLabel
                    })`,
                    boxWidth: 8,
                    font: { size: 10 },
                    usePointStyle: true,
                    pointStyle: 'circle',
                  },
                  maxHeight: 60,
                },
                title: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${context.dataset.label}: ${(
                        context.raw as number
                      ).toLocaleString('id-ID')}`,
                  },
                },
              },
              onClick: handleChartClick,
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

export default SalesBySalesPersonUnFilteredChart;

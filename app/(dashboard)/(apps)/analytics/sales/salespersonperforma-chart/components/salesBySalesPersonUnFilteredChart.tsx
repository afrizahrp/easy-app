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
}

interface SalesBySalesPersonUnFilteredProps {
  isFullScreen?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (selection: SalesPersonSelection | null) => void;
}

const SalesBySalesPersonUnFilteredChart: React.FC<
  SalesBySalesPersonUnFilteredProps
> = ({ isFullScreen = false, onModeChange, onSalesPersonSelect }) => {
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

  React.useEffect(() => {
    console.log('Data dari SalesBySalesPersonUnFilteredChart:', data);
  }, [data]);

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
        salesPersonColorMap[salesPersonName.toLocaleUpperCase()] ||
        getFallbackColor(salesPersonName.toLocaleUpperCase());

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

  // const maxValue = React.useMemo(() => {
  //   if (!chartData || !chartData.datasets.length) return 100_000_000;
  //   const max = Math.max(...chartData.datasets.flatMap((ds) => ds.data), 0);
  //   return max || 100_000_000;
  // }, [chartData]);

  React.useEffect(() => {
    if (error) {
      toast({
        description:
          error.message || 'Failed to load sales data. Please try again.',
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

  const handleChartClick = (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const element = elements[0];
      const datasetIndex = element.datasetIndex;
      const monthIndex = element.index;
      const salesPersonName = chartData?.datasets[datasetIndex]?.label;
      const year = chartData?.datasets[datasetIndex]?.period;
      const month = chartData?.labels[monthIndex] as string;

      if (salesPersonName) {
        console.log('UnFilteredChart Clicked:', {
          salesPersonName,
          year,
          month,
        });
        setSalesPersonName([salesPersonName]);
        onSalesPersonSelect?.({ salesPersonName, year, month });
      }
    }
  };

  return (
    <div
      className={
        isFullScreen
          ? 'fixed inset-0 z-50 bg-white dark:bg-[#18181b] p-4 flex flex-col rounded-none shadow-lg'
          : 'p-4 rounded-lg shadow-sm h-96 w-full'
      }
      style={{
        backgroundColor: hexBackground,
        height: isFullScreen ? '100vh' : undefined,
        width: isFullScreen ? '100vw' : undefined,
        top: isFullScreen ? 0 : undefined,
        left: isFullScreen ? 0 : undefined,
      }}
    >
      <div className='relative flex items-center justify-center mb-2'>
        <h2 className='text-md text-muted-foreground font-semibold mx-auto'>
          Top 5 Sales Performers (in Millions IDR)
        </h2>
        <div className='absolute right-0 top-0 flex items-center space-x-2'>
          <Label htmlFor='chart-mode-period'>
            {isFullScreen ? 'Full Page' : 'Full Width'}
          </Label>
          <Switch
            id='chart-mode-period'
            checked={isFullScreen}
            onCheckedChange={(checked) => onModeChange?.(checked)}
            aria-label='Toggle full screen chart'
          />
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className='flex items-center justify-center h-full'>
          <div className='w-3/4 h-1/2 rounded-lg shimmer' />
        </div>
      ) : isDataReady ? (
        <Bar
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
                  color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`,
                },

                ticks: {
                  callback: (value) =>
                    `${(Number(value) / 1_000_000).toLocaleString('id-ID')}`,
                },
              },
              x: {
                grid: {
                  drawTicks: false,
                  color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`,
                  display: false,
                },
                // @ts-expect-error: categoryPercentage is valid for category axis

                categoryPercentage: 0.6, // default 0.8, makin kecil makin renggang

                barPercentage: 0.7,

                ticks: {
                  color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartLabel})`,
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
  );
};

export default SalesBySalesPersonUnFilteredChart;

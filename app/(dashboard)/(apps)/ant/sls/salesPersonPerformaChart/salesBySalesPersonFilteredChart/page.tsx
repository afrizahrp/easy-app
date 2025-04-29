'use client';
import React, { useRef, useEffect } from 'react';
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

import { Search } from 'lucide-react';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useSalesByPeriodFiltered from '@/queryHooks/sls/analytics/useSalesPersonByPeriodFiltered';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useSalesInvoiceHdFilterStore } from '@/store';
import {
  salesPersonColorMap,
  getFallbackColor,
} from '@/utils/salesPersonColorMap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

interface SalesDataWithFilter {
  period: string;
  totalInvoice: number;
  salesPersonName: string;
  months: { [month: string]: number };
}

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
}

interface SalesBySalesPersonFilteredProps {
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (selection: SalesPersonSelection | null) => void;
}

const SalesBySalesPersonFilteredChart: React.FC<
  SalesBySalesPersonFilteredProps
> = ({ isFullWidth = true, onModeChange, onSalesPersonSelect }) => {
  const { toast } = useToast();
  const { salesPersonName, setSalesPersonName } = useSalesInvoiceHdFilterStore(
    (state) => ({
      salesPersonName: state.salesPersonName,
      setSalesPersonName: state.setSalesPersonName,
    })
  );

  const validSalesPersonNames = Array.isArray(salesPersonName)
    ? salesPersonName.filter((name) => typeof name === 'string' && name.trim())
    : salesPersonName && typeof salesPersonName === 'string' && salesPersonName
      ? [salesPersonName]
      : [];

  const { data, isLoading, isFetching, error } = useSalesByPeriodFiltered({
    salesPersonNames: validSalesPersonNames,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Data dari SalesBySalesPersonFilteredChart:', data);
    console.log('isFullWidth in FilteredChart:', isFullWidth);
    if (containerRef.current) {
      console.log(
        'FilteredChart actual width:',
        containerRef.current.getBoundingClientRect().width
      );
    }
  }, [data, isFullWidth]);

  const chartData = React.useMemo(() => {
    if (!data || !data.length) return null;

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

    const datasets = data.map((entry: SalesDataWithFilter) => {
      const monthsData = entry.months || {};
      const color =
        salesPersonColorMap[entry.salesPersonName.toLocaleUpperCase()] ||
        getFallbackColor(entry.salesPersonName.toLocaleUpperCase());
      return {
        label: entry.salesPersonName,
        data: months.map((month) => monthsData[month] || 0),
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
        period: entry.period,
      };
    });

    return { labels: months, datasets };
  }, [data]);

  const maxValue = React.useMemo(() => {
    if (!chartData || !chartData.datasets.length) return 100_000_000;
    const max = Math.max(...chartData.datasets.flatMap((ds) => ds.data), 0);
    return max || 100_000_000;
  }, [chartData]);

  const handleChartClick = (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const element = elements[0];
      const datasetIndex = element.datasetIndex;
      const monthIndex = element.index;
      const salesPersonName = chartData?.datasets[datasetIndex]?.label;
      const year = chartData?.datasets[datasetIndex]?.period;
      const month = chartData?.labels[monthIndex] as string;

      if (salesPersonName && year && month) {
        console.log('FilteredChart Clicked:', { salesPersonName, year, month });
        onSalesPersonSelect?.({ salesPersonName, year, month });
        onModeChange?.(false); // Set ke half-width untuk TopProductSoldBySalesPerson
      }
    }
  };

  useEffect(() => {
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

  return (
    <div
      ref={containerRef}
      className={`bg-white p-4 rounded-lg shadow-sm h-96 w-full`}
    >
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-md font-semibold'>
          {validSalesPersonNames.length === 1
            ? `Sales Performance by ${validSalesPersonNames[0]} (in Millions IDR)`
            : validSalesPersonNames.length === 2
              ? `Sales Performance by ${validSalesPersonNames.join(' and ')} (in Millions IDR)`
              : validSalesPersonNames.length > 2
                ? `Sales Performance by ${validSalesPersonNames
                    .slice(0, validSalesPersonNames.length - 1)
                    .join(
                      ', '
                    )} and ${validSalesPersonNames[validSalesPersonNames.length - 1]} (in Millions IDR)`
                : 'Sales Performance (in Millions IDR)'}
        </h2>
        <div className='flex items-center space-x-2'>
          <div className='flex justify-center mt-4'>
            <button
              onClick={() => {
                setSalesPersonName([]);
                onSalesPersonSelect?.(null);
                onModeChange?.(true);
              }}
              className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs transition'
            >
              ← Back
            </button>
          </div>

          <Switch
            id='chart-mode-period'
            checked={isFullWidth}
            onCheckedChange={(checked) => onModeChange?.(checked)}
            aria-label='Toggle full width chart'
          />
          <Label htmlFor='chart-mode-period'>
            {isFullWidth ? 'Full Width' : 'Half Width'}
          </Label>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='w-full'>
          {isLoading || isFetching ? (
            <div className='flex items-center justify-center h-80'>
              <Skeleton className='w-3/4 h-1/2 rounded-lg' />
            </div>
          ) : isDataReady ? (
            <div className='h-80 w-full'>
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
                      beginAtZero: true,
                      max: maxValue * 1.1,
                      title: { display: true, text: 'Total Sales' },
                      ticks: {
                        callback: (value) =>
                          `${(Number(value) / 1_000_000).toLocaleString('id-ID')}`,
                      },
                    },
                    x: {
                      title: { display: true, text: 'Month' },
                      grid: { display: false },
                    },
                  },
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${(context.raw as number).toLocaleString('id-ID')} IDR`,
                      },
                    },
                  },

                  onClick: handleChartClick,
                }}
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

export default SalesBySalesPersonFilteredChart;

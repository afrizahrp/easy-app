'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
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
import useMonthlyComparisonSalesPersonInvoiceFiltered from '@/queryHooks/analytics/sales/useMonthlyComparissonSalesPersonInvoiceFiltered';
import { Skeleton } from '@/components/ui/skeleton';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { useMonthYearPeriodStore } from '@/store';
import { months } from '@/utils/monthNameMap';
import { getSalesPersonColor } from '@/utils/getSalesPersonColor';
import { useQueryClient } from '@tanstack/react-query';
import { BarChart2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import SalesPersonSummaryList from './salesPersonSummaryList';
import { Button } from '@/components/ui/button';
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

interface MonthlySalesInvoiceFilteredChartProps {
  isFullWidth?: boolean;
  year?: string;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (selection: SalesPersonSelection | null) => void;
}

const MonthlySalesInvoiceFilteredChart: React.FC<
  MonthlySalesInvoiceFilteredChartProps
> = ({ isFullWidth = true, year, onModeChange, onSalesPersonSelect }) => {
  const queryClient = useQueryClient();
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const hslBackground = `hsla(${
    theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].background
  })`;
  const hexBackground = hslToHex(hslBackground);

  const { salesPersonInvoicePeriod } = useMonthYearPeriodStore();
  const { startPeriod } = salesPersonInvoicePeriod;
  const yearString = startPeriod
    ? new Date(startPeriod).getFullYear().toString()
    : new Date().getFullYear().toString();

  const defaultYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(
    yearString ?? defaultYear
  );

  const { toast } = useToast();

  const { salesPersonInvoiceFilters, setSalesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore((state) => ({
      salesPersonInvoiceFilters: state.salesPersonInvoiceFilters,
      setSalesPersonInvoiceFilters: state.setSalesPersonInvoiceFilters,
    }));

  const validSalesPersonNames = React.useMemo(() => {
    const names = salesPersonInvoiceFilters.salesPersonName;
    return Array.isArray(names)
      ? names.filter((name) => typeof name === 'string' && name.trim())
      : names && typeof names === 'string' && names
        ? [names]
        : [];
  }, [salesPersonInvoiceFilters.salesPersonName]);

  const salespersons = React.useMemo(() => {
    return validSalesPersonNames.map((name) => ({ name }));
  }, [validSalesPersonNames]);

  const { data, isLoading, isFetching, error } =
    useMonthlyComparisonSalesPersonInvoiceFiltered({
      context: 'salesPersonInvoice',
      salesPersonNames: validSalesPersonNames,
    });

  const handleSummaryOpen = () => {
    if (salespersons.length > 4) {
      toast({
        description: `Cannot open summary. Maximum 4 salespeople allowed, but you selected ${salespersons.length}.`,
        color: 'destructive',
      });
      return;
    }
    setIsSummaryOpen(true);
  };

  useEffect(() => {
    queryClient.setQueryDefaults(['salesPersonInvoice'], {
      refetchOnWindowFocus: false,
      refetchInterval: false,
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

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

  const handleChartClick = (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const element = elements[0];
      const datasetIndex = element.datasetIndex;
      const monthIndex = element.index;
      const salesPersonName = chartData?.datasets[datasetIndex]?.label;
      const year =
        chartData?.datasets[datasetIndex]?.period.match(/\d{4}/)?.[0] || '2024';
      const rawMonth = chartData?.labels[monthIndex] as string;
      const month = rawMonth
        ? rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1).toLowerCase()
        : undefined;

      if (salesPersonName && year && month) {
        setSelectedYear(year);
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

  const limitedSalespersons = salespersons.slice(0, 3);

  const dialogSize =
    salespersons.length === 1
      ? 'xl'
      : salespersons.length === 2
        ? '2xl'
        : '3xl';

  return (
    <div
      ref={containerRef}
      className={`bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm h-96 w-full relative`}
      style={{ backgroundColor: hexBackground }}
    >
      <div className='flex flex-row items-center justify-between mb-2'>
        <h2 className='text-md font-semibold text-muted-foreground'>
          {validSalesPersonNames.length === 1
            ? `Monthly Sales by ${validSalesPersonNames[0]} (in Millions IDR)`
            : validSalesPersonNames.length === 2
              ? `Monthly Sales by ${validSalesPersonNames.join(' and ')} (in Millions IDR)`
              : validSalesPersonNames.length > 2
                ? `Monthly Sales by ${validSalesPersonNames
                    .slice(0, validSalesPersonNames.length - 1)
                    .join(', ')} and ${
                    validSalesPersonNames[validSalesPersonNames.length - 1]
                  } (in Millions IDR)`
                : 'Monthly Sales (in Millions of IDR)'}
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
            aria-label='Show all salespeople'
          >
            ← All Salesperson
          </button>

          <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
            <TooltipProvider>
              <UiTooltip>
                <TooltipTrigger asChild>
                  <div>
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs transition flex items-center'
                        onClick={handleSummaryOpen}
                        disabled={salespersons.length > 3}
                        aria-label='Open salesperson summary'
                      >
                        <BarChart2 className='mr-2 h-4 w-4' />
                        Summary
                      </Button>
                    </DialogTrigger>
                  </div>
                </TooltipTrigger>
                {salespersons.length > 3 && (
                  <TooltipContent>
                    <p>
                      Cannot open summary: Maximum 3 salespersons allowed, but
                      you selected {salespersons.length}.
                    </p>
                  </TooltipContent>
                )}
              </UiTooltip>
            </TooltipProvider>

            <DialogContent
              size={dialogSize}
              className='bg-white dark:bg-gray-800'
            >
              <DialogHeader>
                <DialogTitle className='text-gray-800 dark:text-gray-100'>
                  Salesperson Summary
                </DialogTitle>
                <DialogDescription className='text-gray-500 dark:text-gray-400 text-xs'>
                  Salesperson summary list for {selectedYear} in millions of IDR
                </DialogDescription>
              </DialogHeader>
              <div className='w-full'>
                {limitedSalespersons.length > 0 ? (
                  <SalesPersonSummaryList
                    salespersons={limitedSalespersons}
                    year={selectedYear}
                  />
                ) : (
                  <p className='text-gray-500 dark:text-gray-400 text-center'>
                    No salesperson selected. Please select at least one
                    salesperson.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='w-full'>
          {isLoading ? (
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
                    padding: { bottom: 40 },
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
                          const growth = (context.dataset as any)
                            .growthPercentages[context.dataIndex];
                          // Tentukan ikon berdasarkan nilai growth
                          const icon =
                            growth > 0 ? '🔼' : growth < 0 ? '🔻' : '➡️'; // Emoji baru

                          const growthStatus =
                            growth > 0
                              ? `Increase:${growth}%`
                              : growth < 0
                                ? `Decrease:${growth}%`
                                : `No Change:${growth}%`;

                          const salesPerson = context.dataset.label;
                          return [
                            `${salesPerson}`,
                            `Sales: ${amount.toLocaleString('id-ID')} IDR`,
                            `${icon} ${growthStatus}`,
                          ];
                        },
                      },
                    },
                  },
                  onClick: handleChartClick,
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

export default MonthlySalesInvoiceFilteredChart;

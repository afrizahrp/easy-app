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
  ScriptableContext,
  Chart,
} from 'chart.js';
import { hslToHex, cn } from '@/lib/utils';
import { useMonthYearPeriodStore, useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useMonthlyComparisonSalesPersonInvoiceFiltered from '@/queryHooks/analytics/sales/useMonthlyComparisonSalesPersonInvoice';
import {
  salesPersonColorMap,
  getFallbackColor,
} from '@/utils/salesPersonColorMap';
import { useSalesInvoiceHdFilterStore } from '@/store';
import { months } from '@/utils/monthNameMap';
import { getSalesPersonColor } from '@/utils/getSalesPersonColor';
import { Button } from '@/components/ui/button';
import { BarChart2, FileBarChart2, Maximize2, Minimize2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useQueryClient } from '@tanstack/react-query';
import SalesPersonSummaryList from './salesPersonSummaryList';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

// Interface for the data returned by the hook
interface SalesData {
  period: string;
  totalInvoice: number;
  months: {
    month: string;
    sales: {
      salesPersonName: string;
      amount: number;
      growthPercentage: number | null;
    }[];
  }[];
}

interface SalesPersonSelection {
  salesPersonName: string;
  year?: string;
  month?: string;
  color?: string;
}

interface MonthlySalesPersonInvoiceFilteredChartProps {
  height?: number;
  isCompact?: boolean;
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  onSalesPersonSelect?: (selection: SalesPersonSelection | null) => void;
}

const MonthlySalesPersonInvoiceFilteredChart: React.FC<
  MonthlySalesPersonInvoiceFilteredChartProps
> = ({
  height = 250,
  isCompact = false,
  isFullWidth = true,
  onModeChange,
  onSalesPersonSelect,
}) => {
  const queryClient = useQueryClient();
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

  const salesPersonNames = salesPersonInvoiceFilters.salesPersonName || [];

  const { data, isLoading, isFetching, error } =
    useMonthlyComparisonSalesPersonInvoiceFiltered({
      context: 'salesPersonInvoice',
      salesPersonNames,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    });

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const { salesPersonInvoicePeriod } = useMonthYearPeriodStore();
  const { startPeriod } = salesPersonInvoicePeriod;
  const yearString = startPeriod
    ? new Date(startPeriod).getFullYear().toString()
    : new Date().getFullYear().toString();

  const [selectedYear, setSelectedYear] = useState<string>(yearString);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart<'bar', number[], string> | null>(null);

  useEffect(() => {
    console.log('Initial filters:', salesPersonInvoiceFilters);
    console.log('Salesperson Names:', salesPersonNames);
  }, [salesPersonInvoiceFilters, salesPersonNames]);

  useEffect(() => {
    queryClient.setQueryDefaults(['monthlyComparisonSalesPersonInvoice'], {
      refetchOnWindowFocus: false,
      refetchInterval: false,
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  const chartData = React.useMemo(() => {
    if (!data || !data.length) {
      console.log('No data available');
      return null;
    }

    // console.log('Raw data:', JSON.stringify(data, null, 2));

    const allSalesPersons = Array.from(
      new Set(
        data
          .flatMap((d: SalesData) => d.months)
          .flatMap((m) => m.sales.map((s) => s.salesPersonName))
      )
    );

    // console.log('All Salespersons:', allSalesPersons);

    const datasets = allSalesPersons.map((salesPersonName) => {
      const color =
        salesPersonColorMap[salesPersonName.toLowerCase()] ||
        getFallbackColor(salesPersonName);

      const growthPercentages = months.map((month) => {
        let growth: number = 0;
        data.forEach((yearData: SalesData) => {
          const monthData = yearData.months.find((m) => m.month === month);
          if (monthData) {
            const salesPersonData = monthData.sales.find(
              (s) => s.salesPersonName === salesPersonName
            );
            if (salesPersonData && salesPersonData.growthPercentage !== null) {
              growth = salesPersonData.growthPercentage;
            }
          }
        });
        return growth;
      });

      const monthlyData = months.map((month) => {
        let totalAmount = 0;
        data.forEach((yearData: SalesData) => {
          const monthData = yearData.months.find((m) => m.month === month);
          if (monthData && monthData.sales.length > 0) {
            const salesPersonData = monthData.sales.find(
              (s) => s.salesPersonName === salesPersonName
            );
            if (salesPersonData) {
              totalAmount += salesPersonData.amount;
            }
          }
        });
        return totalAmount / 1_000_000;
      });

      // console.log(`Data for ${salesPersonName}:`, monthlyData);
      // console.log(`Growth for ${salesPersonName}:`, growthPercentages);

      return {
        label: salesPersonName,
        data: monthlyData,
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
        barThickness: isFullScreen ? 14 : 10,
        maxBarThickness: 14,
        minBarLength: 2,
        borderRadius: 15,
        period: data[0]?.period,
        growthPercentages,
      };
    });

    const result = { labels: months, datasets };
    console.log('chartData:', result);
    return result;
  }, [data, isFullScreen]);

  useEffect(() => {
    if (chartRef.current) {
      console.log(
        'Chart width:',
        chartRef.current.width,
        'Chart area:',
        chartRef.current.chartArea
      );
    }
  }, [chartData, isFullScreen]);

  const maxValue = React.useMemo(() => {
    if (!chartData) return 0;
    return Math.max(...chartData.datasets.flatMap((ds) => ds.data)) * 1.1;
  }, [chartData]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching data:', error);
      toast({
        description: 'Gagal memuat data penjualan. Coba lagi.',
        variant: 'destructive',
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

  console.log('isDataReady:', isDataReady);

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
      setSelectedYear(year || yearString);
      onSalesPersonSelect?.({ salesPersonName, year, month, color });
    }
  };

  const toggleFullScreen = useCallback(() => {
    if (!chartContainerRef.current) {
      console.warn('Chart container ref is null');
      toast({
        description: 'Gagal mengakses kontainer chart.',
        variant: 'destructive',
      });
      return;
    }

    if (!isFullScreen) {
      // Coba masuk ke mode fullscreen browser
      const requestFullscreen =
        chartContainerRef.current.requestFullscreen ||
        (chartContainerRef.current as any).webkitRequestFullscreen ||
        (chartContainerRef.current as any).mozRequestFullScreen ||
        (chartContainerRef.current as any).msRequestFullscreen;

      if (requestFullscreen) {
        requestFullscreen
          .call(chartContainerRef.current)
          .catch((err: Error) => {
            console.error('Failed to enter fullscreen:', err);
            // Fallback ke mode CSS fullscreen
            setIsFullScreen(true);
            onModeChange?.(true);
            toast({
              description:
                'Mode layar penuh browser gagal, beralih ke mode layar penuh lokal.',
              variant: 'default',
            });
          });
      } else {
        // Jika API fullscreen tidak didukung, langsung ke mode CSS
        setIsFullScreen(true);
        onModeChange?.(true);
        toast({
          description:
            'Mode layar penuh browser tidak didukung, menggunakan mode layar penuh lokal.',
          variant: 'default',
        });
      }
    } else {
      // Coba keluar dari mode fullscreen browser
      if (document.fullscreenElement) {
        const exitFullscreen =
          document.exitFullscreen ||
          (document as any).webkitExitFullscreen ||
          (document as any).mozCancelFullScreen ||
          (document as any).msExitFullscreen;

        if (exitFullscreen) {
          exitFullscreen.call(document).catch((err: Error) => {
            console.error('Failed to exit fullscreen:', err);
            // Fallback ke keluar dari mode CSS
            setIsFullScreen(false);
            onModeChange?.(false);
            toast({
              description:
                'Gagal keluar dari mode layar penuh browser, beralih ke mode normal.',
              variant: 'default',
            });
          });
        }
      } else {
        // Keluar dari mode CSS fullscreen
        setIsFullScreen(false);
        onModeChange?.(false);
      }
    }
  }, [isFullScreen, toast, onModeChange]);

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
    if (chartContainerRef.current && isFullScreen) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [isFullScreen, isFullWidth]);

  const chartTitle =
    salesPersonNames.length === 1
      ? `Sales Performance by ${salesPersonNames[0]} (in Millions IDR)`
      : salesPersonNames.length === 2
        ? `Sales Performance by ${salesPersonNames.join(' and ')} (in Millions IDR)`
        : salesPersonNames.length > 2
          ? `Sales Performance by ${salesPersonNames
              .slice(0, salesPersonNames.length - 1)
              .join(
                ', '
              )} and ${salesPersonNames[salesPersonNames.length - 1]} (in Millions IDR)`
          : 'Sales Performance (in Millions IDR)';

  const limitedSalespersons = salesPersonNames.slice(0, 3);
  const handleSummaryOpen = () => {
    if (limitedSalespersons.length > 3) {
      toast({
        description: `Cannot open summary: Maximum 3 salespersons allowed, but you selected ${limitedSalespersons.length}.`,
        variant: 'destructive',
      });
    } else {
      setIsSummaryOpen(true);
    }
  };

  const dialogSize = () => {
    if (limitedSalespersons.length === 1) {
      return 'xs';
    } else if (limitedSalespersons.length === 2) {
      return '2xl';
    } else {
      return '3xl';
    }
  };

  return (
    <div
      ref={chartContainerRef}
      className={cn(
        `chart-container ${isCompact ? 'compact' : ''}`,
        isFullScreen && !document.fullscreenElement
          ? 'fixed inset-0 z-50 bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-md'
          : 'relative bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm h-96',
        'flex flex-col h-96 w-full box-border'
      )}
      style={{ backgroundColor: hexBackground }}
    >
      <div className='relative flex items-start justify-between mb-2'>
        <h2 className='text-md font-semibold'>{chartTitle}</h2>
        <div className='flex flex-col items-end space-y-2'>
          {!isCompact && (
            <Button
              variant='outline'
              size='sm'
              onClick={toggleFullScreen}
              className='w-10 h-10 p-0 flex items-center justify-center'
              aria-label={
                isFullScreen
                  ? 'Keluar dari mode layar penuh'
                  : 'Masuk ke mode layar penuh'
              }
            >
              {isFullScreen ? (
                <Minimize2 className='h-4 w-4' />
              ) : (
                <Maximize2 className='h-4 w-4' />
              )}
            </Button>
          )}
          <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
            <TooltipProvider>
              <UiTooltip>
                <TooltipTrigger asChild>
                  <div>
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 hover:text-slate-200 text-xs transition flex items-center'
                        onClick={handleSummaryOpen}
                        disabled={salesPersonNames.length > 3}
                        aria-label='Open salesperson summary'
                      >
                        <FileBarChart2 className='mr-2 h-4 w-4' />
                      </Button>
                    </DialogTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent color='default'>
                  {salesPersonNames.length > 3 ? (
                    <p>
                      Cannot open summary: Maximum 3 salespersons allowed, but
                      you selected {salesPersonNames.length}.
                    </p>
                  ) : (
                    <p>Open summary for {selectedYear}</p>
                  )}
                </TooltipContent>
              </UiTooltip>
            </TooltipProvider>
            <DialogContent
              size={dialogSize()}
              className='w-full bg-white dark:bg-gray-800'
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
                    salespersons={limitedSalespersons.map((name) => ({ name }))}
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

      <div className='flex-1 min-h-80 w-full '>
        {isLoading || isFetching ? (
          <div className='flex items-center justify-center h-full'>
            <div className='w-3/4 h-1/2 rounded-lg shimmer' />
          </div>
        ) : isDataReady ? (
          <Bar
            ref={chartRef}
            height={isFullScreen ? undefined : isCompact ? 250 : height}
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              // layout: {
              //   padding: {
              //     bottom: isCompact ? 10 : 20,
              //     top: isCompact ? 5 : 10,
              //     left: isCompact ? 30 : 40,
              //     right: isCompact ? 30 : 40,
              //   },
              // },
              scales: {
                y: {
                  beginAtZero: true,
                  max: maxValue,
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
                  offset: true,
                  title: { display: false, text: 'Bulan' },
                  grid: {
                    drawTicks: false,
                    color: `hsl(${
                      theme?.cssVars[mode === 'dark' ? 'dark' : 'light']
                        .chartGird
                    })`,
                    display: false,
                  },
                  ticks: {
                    autoSkip: false,
                    callback: (value, index) => chartData?.labels[index] ?? '',
                    font: {
                      size: isFullScreen ? 14 : 12,
                    },
                    align: 'center',
                    crossAlign: 'center',
                    maxRotation: 0,
                    minRotation: 0,
                    padding: 10,
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
                    font: { size: isFullScreen ? 12 : 10 },
                    usePointStyle: true,
                    pointStyle: 'circle',
                  },
                  maxHeight: isFullScreen ? 80 : 60,
                },
                title: { display: false },
                tooltip: {
                  enabled: true,
                  position: 'nearest',
                  yAlign: 'top',
                  xAlign: 'left',
                  borderWidth: 1,
                  padding: 8,
                  bodyFont: { size: isFullScreen ? 16 : 14 },
                  titleFont: { size: isFullScreen ? 14 : 12 },
                  callbacks: {
                    title: (tooltipItems) => {
                      const index = tooltipItems[0].dataIndex;
                      return chartData?.labels[index] ?? '';
                    },
                    label: (context) => {
                      const amount = (context.raw as number) * 1_000_000;
                      const growth = (context.dataset as any).growthPercentages[
                        context.dataIndex
                      ];
                      const icon = growth > 0 ? '🔼' : growth < 0 ? '🔻' : '➖';
                      const growthDisplay =
                        growth !== undefined ? growth.toFixed(2) : '0.00';
                      return [
                        `${context.dataset.label}`,
                        `${amount.toLocaleString('id-ID')} ${icon} ${growthDisplay}%`,
                      ];
                    },
                  },
                },
              },
              datasets: {
                bar: {
                  barThickness: isFullScreen ? 14 : 10,
                  maxBarThickness: 14,
                  minBarLength: 2,
                  categoryPercentage: 0.7,
                  barPercentage: 0.8,
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
            <p className='text-sm font-medium'>Data not available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlySalesPersonInvoiceFilteredChart;

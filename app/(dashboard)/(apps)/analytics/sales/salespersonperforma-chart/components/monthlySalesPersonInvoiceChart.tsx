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
  Chart,
} from 'chart.js';
import { hslToHex } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useMonthlyComparisonSalesPersonInvoice from '@/queryHooks/analytics/sales/useMonthlyComparisonSalesPersonInvoice';
import {
  salesPersonColorMap,
  getFallbackColor,
} from '@/utils/salesPersonColorMap';
import { useSalesInvoiceHdFilterStore } from '@/store';
import Loading from '@/components/ui/loading';

import { months as monthName } from '@/utils/monthNameMap';
import { getShortMonth } from '@/utils/getShortmonths';
import { getSalesPersonColor } from '@/utils/getSalesPersonColor';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

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
  const queryClient = useQueryClient();
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const hslBackground = `hsla(${
    theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].background
  })`;

  const months = monthName.map((month) => getShortMonth(month));

  // Function to normalize month format
  const normalizeMonth = (month: string): string => {
    const monthMap: { [key: string]: string } = {
      January: 'Jan',
      February: 'Feb',
      March: 'Mar',
      April: 'Apr',
      May: 'May',
      June: 'Jun',
      July: 'Jul',
      August: 'Aug',
      September: 'Sep',
      October: 'Oct',
      November: 'Nov',
      December: 'Dec',
    };
    return monthMap[month] || month;
  };

  const hexBackground = hslToHex(hslBackground);
  const { toast } = useToast();

  const { salesPersonInvoiceFilters, setSalesPersonInvoiceFilters } =
    useSalesInvoiceHdFilterStore((state) => ({
      salesPersonInvoiceFilters: state.salesPersonInvoiceFilters,
      setSalesPersonInvoiceFilters: state.setSalesPersonInvoiceFilters,
    }));

  // Use salesPersonNames from store, allow empty array for unfiltered data
  const salesPersonNames = salesPersonInvoiceFilters.salesPersonName || [];

  // Call the hook with context and salesPersonNames
  const { data, isLoading, isFetching, error } =
    useMonthlyComparisonSalesPersonInvoice({
      context: 'salesPersonInvoice',
      salesPersonNames,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    });

  const [isFullScreen, setIsFullScreen] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart<'bar', number[], string> | null>(null);

  // Log filter, salesperson names, and hook state for debugging
  // useEffect(() => {
  //   console.log(
  //     'Initial filters:',
  //     JSON.stringify(salesPersonInvoiceFilters, null, 2)
  //   );
  //   console.log('Salesperson Names:', salesPersonNames);
  //   console.log('Hook Data:', JSON.stringify(data, null, 2));
  //   console.log('Is Loading:', isLoading, 'Is Fetching:', isFetching);
  //   if (error) {
  //     console.error('Hook Error:', error);
  //   }
  // }, [
  //   salesPersonInvoiceFilters,
  //   salesPersonNames,
  //   data,
  //   isLoading,
  //   isFetching,
  //   error,
  // ]);

  // Set query defaults
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

    // Debug: Log raw data to see month format from API
    console.log('Raw data from API:', JSON.stringify(data, null, 2));
    console.log(
      'Available months in API data:',
      data[0]?.months.map((m) => m.month)
    );

    const allSalesPersons = Array.from(
      new Set(
        data
          .flatMap((d) => d.months)
          .flatMap((m) => m.sales.map((s) => s.salesPersonName))
      )
    );

    console.log('Months from component:', months);
    console.log('Data:', data);

    // Debug: Check if months match between component and API data
    const apiMonths = data[0]?.months.map((m) => m.month) || [];
    console.log('API months:', apiMonths);
    console.log('Component months:', months);
    console.log('Month matching test:');
    months.forEach((month) => {
      const found = apiMonths.find(
        (apiMonth) => normalizeMonth(apiMonth) === month
      );
      console.log(`${month}: ${found ? 'MATCH' : 'NO MATCH'}`);
    });

    const datasets = allSalesPersons.map((salesPersonName) => {
      const color =
        salesPersonColorMap[salesPersonName.toLocaleUpperCase().trim()] ||
        getFallbackColor(salesPersonName);

      const growthPercentages = months.map((month) => {
        let growth: number = 0;
        data.forEach((yearData) => {
          const monthData = yearData.months.find(
            (m) => normalizeMonth(m.month) === month
          );
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
        data.forEach((yearData) => {
          const monthData = yearData.months.find(
            (m) => normalizeMonth(m.month) === month
          );
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
        barThickness: isFullScreen ? 15 : 8,
        maxBarThickness: 15,
        minBarLength: 2,
        borderRadius: 15,
        period: data && data.length > 0 ? data[0].period : undefined,
        growthPercentages,
      };
    });

    const result = { labels: months, datasets };
    console.log('Final chartData:', result);
    return result;
  }, [data, isFullScreen]);

  useEffect(() => {
    if (chartRef.current) {
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
        description: 'Failed to fetch data for the chart.',
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

  const toggleFullScreen = () => {
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
  };

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

  return (
    <div
      ref={chartContainerRef}
      className={`chart-container ${isCompact ? 'compact' : ''} ${
        isFullScreen && !document.fullscreenElement
          ? 'fixed inset-0 z-50 bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-md'
          : 'relative bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm'
      } flex flex-col h-fit min-h-[250px] w-full box-border`}
      style={{ backgroundColor: hexBackground }}
    >
      <div className='relative flex items-center justify-between mb-2'>
        <h2 className='text-sm text-muted-foreground font-semibold ml-2'>
          Monthly Sales per Salesperson (Above 300M IDR)
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
            <Loading size='md' text='Loading chart data...' />
          </div>
        ) : isDataReady ? (
          <Bar
            ref={chartRef}
            height={isFullScreen ? undefined : isCompact ? 300 : height}
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  bottom: isCompact ? 10 : 20,
                  top: isCompact ? 5 : 10,
                  left: isCompact ? 30 : 40,
                  right: isCompact ? 30 : 40,
                },
              },
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
                  // titleFont: { size: isFullScreen ? 14 : 12 },
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
                  barThickness: isFullScreen ? 10 : 6,
                  maxBarThickness: 10,
                  minBarLength: 2,
                  categoryPercentage: 0.5,
                  barPercentage: 0.6,
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
    </div>
  );
};

export default MonthlySalesPersonInvoiceChart;

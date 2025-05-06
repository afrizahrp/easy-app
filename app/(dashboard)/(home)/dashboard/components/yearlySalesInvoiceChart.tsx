'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import { hslToHex, generateYearColorPalette } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useYearlySalesInvoice from '@/queryHooks/dashboard/sales/useYearlySalesInvoice';
import CustomTooltip from './customTooltip';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

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

  // State untuk tooltip
  const [tooltipState, setTooltipState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    invoice: string;
    growth: number;
    year: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    invoice: '',
    growth: 0,
    year: '',
  });

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return null;

    const sortedData = [...data].sort(
      (a, b) => Number(a.period) - Number(b.period)
    );
    const years = sortedData.map((d) => d.period);
    const colorPalette = generateYearColorPalette(years);

    // const handleChartClick = (event: any, elements: any[]) => {
    //     if (isCompact || elements.length === 0) return;

    //     const element = elements[0];
    //     const datasetIndex = element.datasetIndex;
    //     const monthIndex = element.index;
    //     const salesPersonName = chartData?.datasets[datasetIndex]?.label;
    //     const year = chartData?.datasets[datasetIndex]?.period;
    //     const month = chartData?.labels[monthIndex];
    //   };

    return {
      labels: years,
      datasets: [
        {
          label: '',
          data: years.map((year) => {
            const yearData = sortedData.find((d) => d.period === year);
            return yearData ? yearData.totalInvoice / 1_000_000 : 0;
          }),
          backgroundColor: (
            ctx: import('chart.js').ScriptableContext<'bar'>
          ) => {
            const chart = ctx.chart;
            const { ctx: canvasCtx, chartArea } = chart;

            const year = years[ctx.dataIndex];
            const [from, to] = colorPalette[years.indexOf(year)] || [
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
          barThickness: 25,
          borderRadius: 15,
        },
      ],
    } as import('chart.js').ChartData<'bar', number[], string>;
  }, [data]);

  const maxValue = React.useMemo(() => {
    if (!chartData) return 0;
    return Math.max(...chartData.datasets.flatMap((ds) => ds.data));
  }, [chartData]);

  React.useEffect(() => {
    if (error) {
      toast({
        description: 'Failed to load sales data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  React.useEffect(() => {
    return () => {
      const tooltipEl = document.getElementById('chartjs-tooltip');
      if (tooltipEl) {
        tooltipEl.remove();
      }
    };
  }, []);

  const isDataReady =
    !!chartData &&
    Array.isArray(chartData.labels) &&
    chartData.labels.length > 0 &&
    Array.isArray(chartData.datasets) &&
    chartData.datasets.some(
      (ds) => Array.isArray(ds.data) && ds.data.length > 0
    );

  return (
    <motion.div
      className={`chart-container ${isCompact ? 'compact' : ''} bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm flex flex-col h-fit min-h-[250px] w-full`}
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
      <div className='relative flex items-center mb-2'>
        <h2 className='text-sm text-muted-foreground font-semibold ml-2'>
          Sales Invoice by Yearly(in Millions IDR)
        </h2>
      </div>

      <div className='flex-1 min-h-0 w-full'>
        {isLoading || isFetching ? (
          <div className='flex items-center justify-center h-full'>
            <div className='w-3/4 h-1/2 rounded-lg shimmer' />
          </div>
        ) : isDataReady ? (
          <>
            <Bar
              key={isFullWidth ? 'full' : 'half'}
              height={isCompact ? 250 : height}
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
                    grid: {
                      drawTicks: false,
                      color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`,
                    },
                    ticks: {
                      callback: (value: unknown) => {
                        const val = Number(value);
                        return `${val.toLocaleString('id-ID')}`;
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
                    },
                    grid: {
                      drawTicks: false,
                      color: `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`,
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
                    enabled: false,
                    external: (context) => {
                      const { chart, tooltip } = context;
                      if (!chartData || !chartData.labels) {
                        setTooltipState((prev) => ({
                          ...prev,
                          visible: false,
                        }));
                        return;
                      }

                      if (tooltip.opacity === 0) {
                        setTooltipState((prev) => ({
                          ...prev,
                          visible: false,
                        }));
                        return;
                      }

                      if (tooltip.body) {
                        const year =
                          chartData.labels[tooltip.dataPoints[0].dataIndex] ??
                          '';
                        const yearData = data.find((d) => d.period === year);
                        const invoice = (
                          tooltip.dataPoints[0].raw as number
                        ).toLocaleString('id-ID');
                        const growth = yearData?.growthPercentage ?? 0;

                        setTooltipState({
                          visible: true,
                          x: chart.canvas.offsetLeft + tooltip.caretX + 10, // Offset kecil ke kanan
                          y: chart.canvas.offsetTop + tooltip.caretY - 3, // Lebih dekat ke bar
                          invoice,
                          growth,
                          year,
                        });

                        console.log(
                          `Year: ${year}, Growth: ${growth}, Status: ${growth >= 0 ? 'Growth' : 'Down'}`
                        );
                      }
                    },
                  },
                },
              }}
            />
            <CustomTooltip
              visible={tooltipState.visible}
              x={tooltipState.x}
              y={tooltipState.y}
              invoice={tooltipState.invoice}
              growth={tooltipState.growth}
              year={tooltipState.year}
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

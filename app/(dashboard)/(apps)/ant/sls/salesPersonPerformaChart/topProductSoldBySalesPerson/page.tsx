'use client';
import React, { useState } from 'react';
import useTopProductsBySalesPerson from '@/queryHooks/sls/analytics/useTopProductBySalesPerson';
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
import { getGridConfig, getLabel } from '@/lib/appex-chart-options';
import { useTheme } from 'next-themes';

import { useThemeStore } from '@/store';
import { themes } from '@/config/thems';

import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

interface TopProductSoldBySalesPersonProps {
  salesPersonName: string;
  year?: string;
  month?: string;
  sortBy?: string;
  onClose: () => void;
}

const TopProductSoldBySalesPerson: React.FC<
  TopProductSoldBySalesPersonProps
> = ({ salesPersonName, year, month, sortBy, onClose }) => {
  const { toast } = useToast();

  const { theme: config, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  const [chartMode, setChartMode] = useState<'qty' | 'total_amount'>('qty');

  // Extract year and month period from the month prop (assuming format "YYYY-MM")
  const [yearPeriod, monthPeriod] = [year, month];
  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useTopProductsBySalesPerson({
    salesPersonName,
    yearPeriod,
    monthPeriod,
    sortBy: chartMode,
    enabled: !!salesPersonName && !!yearPeriod && !!monthPeriod,
  });

  // console.log('periodDariTopProductSold:', yearPeriod, monthPeriod);

  React.useEffect(() => {
    if (productError) {
      toast({
        description:
          productError.message ||
          'Failed to load product data. Please try again.',
        color: 'destructive',
      });
    }
  }, [productError?.message]); // Fokus hanya ke message

  const productChartData = React.useMemo(() => {
    if (!productData || !productData.length) return null;

    const labels = productData.map((item) => item.productName);
    const dataValues = productData.map((item) =>
      chartMode === 'qty' ? item.qty : item.total_amount
    );

    return {
      labels,
      datasets: [
        {
          label: chartMode === 'qty' ? 'Quantity Sold' : 'Total Amount (IDR)',
          data: dataValues,
          backgroundColor: (ctx: ScriptableContext<'bar'>) => {
            const { chartArea, ctx: canvasCtx } = ctx.chart;
            if (!chartArea) return '#8884d8';
            const gradient = canvasCtx.createLinearGradient(
              0,
              chartArea.bottom,
              0,
              chartArea.top
            );
            gradient.addColorStop(0, '#8884d8');
            gradient.addColorStop(1, '#82ca9d');
            return gradient;
          },
          borderColor: '#8884d8',
          borderWidth: 1,
        },
      ],
    };
  }, [productData, chartMode]);

  const productMaxValue = React.useMemo(() => {
    if (!productChartData || !productChartData.datasets.length)
      return chartMode === 'qty' ? 100 : 100_000_000;
    const max = Math.max(
      ...productChartData.datasets.flatMap((ds) => ds.data),
      0
    );
    return max || (chartMode === 'qty' ? 100 : 100_000_000);
  }, [productChartData, chartMode]);

  const series = productData
    ? [
        {
          data: productData.map((item) =>
            chartMode === 'qty' ? item.qty : item.total_amount
          ),
        },
      ]
    : [];

  const options: any = {
    chart: {
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        barHeight: '100%',
        distributed: true,
        horizontal: true,
        dataLabels: { position: 'bottom' },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff'],
      },
      formatter: function (val: number, opt: any) {
        return (
          opt.w.globals.labels[opt.dataPointIndex] +
          ': ' +
          val.toLocaleString('id-ID')
        );
      },
      offsetX: 0,
      dropShadow: { enabled: true },
    },
    stroke: {
      show: false,
      width: 1,
      colors: [
        `hsl(${
          theme?.cssVars[
            mode === 'dark' || mode === 'system' ? 'dark' : 'light'
          ].chartLabel
        })`,
      ],
    },
    colors: [
      `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].primary})`,
      `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].info})`,
      `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].success})`,
      `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].warning})`,
    ],
    tooltip: { theme: mode === 'dark' ? 'dark' : 'light' },
    grid: getGridConfig(
      `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`
    ),
    yaxis: {
      show: false,
      labels: {
        style: {
          colors: [
            `hsl(${
              theme?.cssVars[
                mode === 'dark' || mode === 'system' ? 'dark' : 'light'
              ].chartLabel
            })`,
          ],
        },
      },
    },
    xaxis: {
      categories: productData?.map((item) => item.productName) ?? [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: getLabel(
        `hsl(${
          theme?.cssVars[
            mode === 'dark' || mode === 'system' ? 'dark' : 'light'
          ].chartLabel
        })`
      ),
    },
    legend: {
      labels: {
        colors: `hsl(${
          theme?.cssVars[
            mode === 'dark' || mode === 'system' ? 'dark' : 'light'
          ].chartLabel
        })`,
      },
      itemMargin: { horizontal: 5, vertical: 5 },
      markers: { width: 10, height: 10, radius: 10, offsetX: isRtl ? 5 : -5 },
    },
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  };

  const isProductDataReady =
    !!productChartData &&
    Array.isArray(productChartData.labels) &&
    productChartData.labels.length > 0 &&
    Array.isArray(productChartData.datasets) &&
    productChartData.datasets.some((ds) => ds.data.some((value) => value > 0));

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm h-full'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-md font-semibold'>
          Top 10 Products Sold by {salesPersonName} in {month} {year}
        </h3>
        <div className='flex items-center space-x-2'>
          <Switch
            id='chart-mode-product'
            checked={chartMode === 'total_amount'}
            onCheckedChange={(checked) =>
              setChartMode(checked ? 'total_amount' : 'qty')
            }
            aria-label='Toggle chart mode'
          />
          <Label htmlFor='chart-mode-product'>
            {chartMode === 'qty' ? 'Quantity' : 'Total Amount'}
          </Label>
          <Button variant='outline' size='sm' onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
      {isProductLoading ? (
        <div className='flex items-center justify-center h-64'>
          <Skeleton className='w-3/4 h-1/2 rounded-lg' />
        </div>
      ) : isProductDataReady ? (
        <div className='h-64'>
          <div className='h-64'>
            <Chart
              options={options}
              series={series}
              type='bar'
              height={'100%'}
              width={'100%'}
            />
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-80 text-gray-400'>
          <div className='relative w-40 h-40 mb-4'>
            {/* Kepala */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 200 200'
              className='absolute w-40 h-40 animate-bounce-head'
            >
              <circle
                cx='100'
                cy='100'
                r='80'
                fill='#FCD34D'
                stroke='#FBBF24'
                strokeWidth='5'
              />

              {/* Mata X */}
              <line
                x1='75'
                y1='80'
                x2='85'
                y2='90'
                stroke='#78350F'
                strokeWidth='5'
                strokeLinecap='round'
              />
              <line
                x1='85'
                y1='80'
                x2='75'
                y2='90'
                stroke='#78350F'
                strokeWidth='5'
                strokeLinecap='round'
              />

              <line
                x1='115'
                y1='80'
                x2='125'
                y2='90'
                stroke='#78350F'
                strokeWidth='5'
                strokeLinecap='round'
              />
              <line
                x1='125'
                y1='80'
                x2='115'
                y2='90'
                stroke='#78350F'
                strokeWidth='5'
                strokeLinecap='round'
              />

              {/* Mulut Zigzag */}
              <path
                d='M70 130 Q80 120 90 130 T110 130 T130 130'
                stroke='#78350F'
                strokeWidth='5'
                fill='none'
                strokeLinecap='round'
              />
            </svg>

            {/* Martil */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 100 100'
              className='absolute w-16 h-16 left-1/2 -top-12 transform -translate-x-1/2 animate-hammer-hard'
            >
              <rect
                x='40'
                y='20'
                width='20'
                height='40'
                rx='5'
                fill='#6B7280'
              />
              <rect x='47' y='0' width='6' height='25' rx='2' fill='#9CA3AF' />
            </svg>

            {/* Efek Pusing */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 100 100'
              className='absolute w-12 h-12 left-1/2 top-0 transform -translate-x-1/2 animate-spin-fast'
            >
              <polygon points='50,10 55,20 45,20' fill='#F87171' />
              <polygon points='20,40 25,50 15,50' fill='#60A5FA' />
              <polygon points='80,40 85,50 75,50' fill='#34D399' />
            </svg>

            {/* Puff Ledakan */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 100 100'
              className='absolute w-16 h-16 left-1/2 top-4 transform -translate-x-1/2 animate-puff'
            >
              <circle cx='50' cy='50' r='20' fill='#ffffff88' />
              <circle cx='70' cy='40' r='10' fill='#ffffff55' />
              <circle cx='30' cy='40' r='10' fill='#ffffff55' />
            </svg>
          </div>

          <p className='text-sm font-medium'>Boom! Dizzy attack!</p>
        </div>
      )}
    </div>
  );
};

export default TopProductSoldBySalesPerson;

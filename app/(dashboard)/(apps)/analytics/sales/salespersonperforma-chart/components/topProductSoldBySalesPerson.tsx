'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import gradientPlugin from 'chartjs-plugin-gradient';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import useTopProductsBySalesPerson from '@/queryHooks/sls/analytics/useTopProductBySalesPerson';
import { getGridConfig, getLabel } from '@/lib/appex-chart-options';
import { useTheme } from 'next-themes';
import { useThemeStore } from '@/store';
import { themes } from '@/config/thems';
import { X } from 'lucide-react';

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
  const theme = themes.find((t) => t.name === config);

  const [chartMode, setChartMode] = useState<'qty' | 'total_amount'>('qty');
  const containerRef = useRef<HTMLDivElement>(null);

  const [yearPeriod, monthPeriod] = [year, month];
  const {
    data: productData,
    isLoading,
    error,
  } = useTopProductsBySalesPerson({
    salesPersonName,
    yearPeriod,
    monthPeriod,
    sortBy: chartMode,
    enabled: !!salesPersonName && !!yearPeriod && !!monthPeriod,
  });

  useEffect(() => {
    if (error) {
      toast({
        description: error.message || 'Failed to load product data.',
        color: 'destructive',
      });
    }
  }, [error?.message]);

  useEffect(() => {
    if (containerRef.current) {
      console.log(
        'TopProduct container width:',
        containerRef.current.getBoundingClientRect().width
      );
    }
  }, [productData]);

  const labels = productData?.map((item) => item.productName) || [];
  const series = [
    {
      data:
        productData?.map((item) =>
          chartMode === 'qty' ? item.qty : item.total_amount
        ) || [],
    },
  ];

  const options: any = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        barHeight: '100%',
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: 'bottom',
        },
        colors: {
          backgroundBarColor: 'rgba(0,0,0,0.1)',
          gradient: {
            enabled: true,
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.2,
            gradientToColors: ['#4F6D7A', '#D0E1F9'],
            stops: [0, 100],
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff'],
      },
      formatter: function (val: number, opt: any) {
        return `${opt.w.globals.labels[opt.dataPointIndex]}: ${val.toLocaleString('id-ID')}`;
      },
      offsetX: 0,
      dropShadow: {
        enabled: true,
      },
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
    tooltip: {
      theme: mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: function (val: number, opt: any) {
          const productName = opt.w.globals.labels[opt.dataPointIndex];
          return `${productName}: ${val.toLocaleString('id-ID')}`;
        },
      },
    },
    grid: getGridConfig(
      `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`
    ),
    yaxis: {
      show: false,
      axisTicks: {
        show: true,
      },
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
      formatter: function (value: string | number) {
        if (typeof value === 'number') {
          return value.toLocaleString('id-ID');
        }
        const num = Number(value);
        if (!isNaN(num)) {
          return num.toLocaleString('id-ID');
        }

        return value;
      },
    },
    xaxis: {
      categories: labels,
      labels: getLabel(
        `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartLabel})`
      ),
      formatter: function (value: string | number) {
        if (chartMode === 'total_amount') {
          const num = typeof value === 'number' ? value : Number(value);
          if (!isNaN(num)) {
            return num.toLocaleString('id-ID');
          }
        }
        return value;
      },
    },
  };

  const isDataReady =
    !!productData?.length && series[0].data.some((v) => v > 0);

  return (
    <div
      ref={containerRef}
      className='bg-white p-4 rounded-lg shadow-md h-full w-full'
    >
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-sm text-muted-foreground'>
          Top 3 Products Sold
          <span className='block text-sm text-muted-foreground font-normal mt-1'>
            by {salesPersonName} in {month} {year}
          </span>
        </h3>
        <div className='flex items-center gap-2 '>
          <Label
            htmlFor='chart-mode-product'
            className='text-xs text-muted-foreground'
          >
            {chartMode === 'qty' ? ' By Qty (in Unit)' : 'By Amount (in IDR)'}
          </Label>
          <Switch
            id='chart-mode-product'
            checked={chartMode === 'total_amount'}
            onCheckedChange={(checked) =>
              setChartMode(checked ? 'total_amount' : 'qty')
            }
            aria-label='Toggle chart mode'
          />

          {/* <button
            type='button'
            onClick={onClose}
            className='absolute top-4 right-4 p-1 rounded hover:bg-red-50'
            aria-label='Close'
          >
            <X className='w-5 h-5 text-red-500' />
          </button> */}
        </div>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center h-64'>
          <Skeleton className='w-3/4 h-1/2 rounded-lg' />
        </div>
      ) : isDataReady ? (
        <div className='h-64 w-full'>
          <Chart
            options={options}
            series={series}
            type='bar'
            height='100%'
            width='100%'
          />
        </div>
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

export default TopProductSoldBySalesPerson;

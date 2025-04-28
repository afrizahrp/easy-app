'use client';

import React, { useState, useEffect } from 'react';
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
        // Menambahkan gradient pada bar
        colors: {
          backgroundBarColor: 'rgba(0,0,0,0.1)',
          gradient: {
            enabled: true, // Mengaktifkan gradient
            shade: 'light', // Menggunakan shade terang
            type: 'horizontal', // Gradient horizontal
            shadeIntensity: 0.2, // Intensitas bayangan
            gradientToColors: ['#4F6D7A', '#D0E1F9'], // Warna gradasi akhir
            stops: [0, 100], // Posisi gradasi
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
        // Jika value adalah angka, beri pemisah ribuan
        if (typeof value === 'number') {
          return value.toLocaleString('id-ID');
        }
        // Jika value string, cek apakah bisa diubah ke angka
        const num = Number(value);
        if (!isNaN(num)) {
          return num.toLocaleString('id-ID');
        }
        // Jika bukan angka, tampilkan apa adanya (misal nama produk)
        return value;
      },
    },
    xaxis: {
      categories: labels,
      labels: getLabel(
        `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartLabel})`
      ),
      formatter: function (value: string | number) {
        // Jika value adalah angka, beri pemisah ribuan
        if (typeof value === 'number') {
          return value.toLocaleString('id-ID');
        }
        // Jika value string, cek apakah bisa diubah ke angka
        const num = Number(value);
        if (!isNaN(num)) {
          return num.toLocaleString('id-ID');
        }
        // Jika bukan angka, tampilkan apa adanya (misal nama produk)
        return value;
      },
    },
  };

  const isDataReady =
    !!productData?.length && series[0].data.some((v) => v > 0);

  return (
    <div className='bg-white p-4 rounded-lg shadow-md h-full'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-md font-semibold'>
          Top 3 Products Sold by {salesPersonName} in {month} {year}
        </h3>
        <div className='flex items-center gap-2'>
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

      {isLoading ? (
        <div className='flex items-center justify-center h-64'>
          <Skeleton className='w-3/4 h-1/2 rounded-lg' />
        </div>
      ) : isDataReady ? (
        <div className='h-64'>
          <Chart
            options={options}
            series={series}
            type='bar'
            height='100%'
            width='100%'
          />
        </div>
      ) : (
        <div className='flex items-center justify-center h-64 text-gray-400'>
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default TopProductSoldBySalesPerson;

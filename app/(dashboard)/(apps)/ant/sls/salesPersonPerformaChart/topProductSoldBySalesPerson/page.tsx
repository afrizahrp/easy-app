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
  ScriptableContext,
} from 'chart.js';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useTopProductsBySalesPerson from '@/queryHooks/sls/analytics/useTopProductBySalesPerson';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
  month: string;
  onClose: () => void;
}

const TopProductSoldBySalesPerson: React.FC<
  TopProductSoldBySalesPersonProps
> = ({ salesPersonName, month, onClose }) => {
  const { toast } = useToast();
  const [chartMode, setChartMode] = useState<'qty' | 'total_amount'>('qty');

  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useTopProductsBySalesPerson({
    salesPersonName,
    month,
    enabled: !!salesPersonName && !!month,
  });

  React.useEffect(() => {
    if (productError) {
      toast({
        description:
          productError.message ||
          'Failed to load product data. Please try again.',
        color: 'destructive',
      });
    }
  }, [productError, toast]);

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
          Top 10 Products Sold by {salesPersonName} in {month}
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
          <Bar
            data={productChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: { bottom: 20 },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: productMaxValue * 1.1,
                  title: {
                    display: true,
                    text:
                      chartMode === 'qty'
                        ? 'Quantity Sold'
                        : 'Total Amount (IDR)',
                  },
                  ticks: {
                    callback: (value) =>
                      chartMode === 'qty'
                        ? Number(value).toLocaleString('id-ID')
                        : `${(Number(value) / 1_000_000).toLocaleString('id-ID')}M`,
                  },
                },
                x: {
                  title: { display: true, text: 'Product Name' },
                  grid: { display: false },
                  ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45,
                  },
                },
              },
              plugins: {
                legend: { position: 'top' },
                title: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      chartMode === 'qty'
                        ? `${(context.raw as number).toLocaleString('id-ID')} units`
                        : `${(context.raw as number).toLocaleString('id-ID')} IDR`,
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-64 text-gray-400'>
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
          <p className='text-sm font-medium'>No product data available</p>
        </div>
      )}
    </div>
  );
};

export default TopProductSoldBySalesPerson;

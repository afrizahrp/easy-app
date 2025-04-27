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
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useSalesPersonByPeriod from '@/queryHooks/sls/analytics/useSalesPersonByPeriod';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

// Daftarkan semua plugin dan komponen sekali
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

// Gunakan tipe dari hook
interface SalesDataWithoutFilter {
  period: string;
  totalInvoice: number;
  months: {
    month: string;
    sales: { salesPersonName: string; amount: number }[];
  }[];
}

interface SalesDataWithFilter {
  period: string;
  totalInvoice: number;
  salesPersonName: string;
  months: { month: string; amount: number }[];
}

type SalesData = SalesDataWithoutFilter | SalesDataWithFilter;

interface SalesPersonByPeriodChartProps {
  isFullWidth?: boolean;
  onModeChange?: (isFullPage: boolean) => void;
  salesPersonNames?: string[]; // Tambahkan untuk mendukung filter
}

const SalesPersonByPeriodChart: React.FC<SalesPersonByPeriodChartProps> = ({
  isFullWidth = false,
  onModeChange,
  salesPersonNames,
}) => {
  const { toast } = useToast();
  const { data, isLoading, isFetching, error } = useSalesPersonByPeriod({
    salesPersonNames,
  });

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

    const colorPalette = [
      ['#1e3a8a', '#3b82f6'], // Navy → Blue
      ['#10b981', '#6ee7b7'], // Green → Light Green
      ['#e11d48', '#f472b6'], // Red → Pink
      ['#9333ea', '#c084fc'], // Purple
      ['#f59e0b', '#fcd34d'], // Amber
      ['#0ea5e9', '#7dd3fc'], // Sky
    ];

    // Deteksi apakah data menggunakan struktur dengan filter
    const isFilteredData = 'salesPersonName' in data[0];

    if (isFilteredData) {
      const datasets = (data as SalesDataWithFilter[]).map((entry, idx) => ({
        label: entry.salesPersonName,
        data: months.map((month) => {
          const monthData = entry.months.find((m) => m.month === month);
          return monthData ? monthData.amount : 0;
        }),
        backgroundColor: (ctx: ScriptableContext<'bar'>) => {
          const { chartArea, ctx: canvasCtx } = ctx.chart;
          const [from, to] = colorPalette[idx % colorPalette.length];
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
        borderColor: colorPalette[idx % colorPalette.length][0],
        borderWidth: 1,
      }));

      return { labels: months, datasets };
    }

    // Logika untuk data tanpa filter
    const allSalesPersons = Array.from(
      new Set(
        (data as SalesDataWithoutFilter[])
          .flatMap((d) => d.months)
          .flatMap((m) => m.sales.map((s) => s.salesPersonName))
      )
    );

    const datasets = allSalesPersons.map((salesPersonName, spIdx) => ({
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
        const [from, to] = colorPalette[spIdx % colorPalette.length];
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
      borderColor: colorPalette[spIdx % colorPalette.length][0],
      borderWidth: 1,
    }));

    return { labels: months, datasets };
  }, [data]);

  // Hitung nilai maksimum untuk skala y
  const maxValue = React.useMemo(() => {
    if (!chartData || !chartData.datasets.length) return 100_000_000;
    const max = Math.max(...chartData.datasets.flatMap((ds) => ds.data), 0);
    return max || 100_000_000; // Default jika semua nilai 0
  }, [chartData]);

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

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm h-96'>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-md font-semibold'>
          Sales by Period (in Millions IDR)
        </h2>
        <div className='flex items-center space-x-2'>
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
      {isLoading || isFetching ? (
        <div className='h-72 flex flex-col gap-2'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-48 w-full' />
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
                beginAtZero: true,
                max: maxValue * 1.1,
                title: { display: true, text: 'Total Sales (Million IDR)' },
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
          }}
        />
      ) : (
        <Alert color='destructive'>
          <AlertDescription>
            <div> No data available for the selected period.</div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SalesPersonByPeriodChart;

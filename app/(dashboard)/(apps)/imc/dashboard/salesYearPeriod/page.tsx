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
} from 'chart.js';
import gradientPlugin from 'chartjs-plugin-gradient';
ChartJS.register(gradientPlugin);

import { useToast } from '@/components/ui/use-toast';
import useSalesPeriod from '@/queryHooks/sls/dashboard/useSalesPeriod';
import { Switch } from '@/components/ui/switch'; // Impor Switch dari Shadcn UI
import { Label } from '@/components/ui/label'; // Impor Label untuk memberikan teks pada Switch

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesByPeriodChartProps {
  onModeChange?: (isFullPage: boolean) => void; // Prop untuk mengirimkan perubahan mode ke parent
}

const SalesByPeriodChart: React.FC<SalesByPeriodChartProps> = ({
  onModeChange,
}) => {
  const { toast } = useToast();
  const { data, isLoading, isFetching, error } = useSalesPeriod();
  const [isFullWidth, setIsFullWidth] = React.useState(true); // State untuk mode full width atau half width

  // Ketika Switch berubah, update state dan panggil onModeChange
  const handleModeChange = (checked: boolean) => {
    setIsFullWidth(checked);
    if (onModeChange) {
      onModeChange(checked);
    }
  };

  const chartData = React.useMemo(() => {
    if (!data) return null;

    const allYears = data.map((d) => d.period);
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

    const baseChartData = months.map((month) => {
      const row: Record<string, string | number> = { month };
      allYears.forEach((year) => {
        const yearData = data.find((d) => d.period === year);
        row[year] = yearData?.months[month] || 0;
      });
      return row;
    });

    const colorPalette = [
      ['#1e3a8a', '#3b82f6'], // Navy → Blue
      ['#10b981', '#6ee7b7'], // Green → Light Green
      ['#e11d48', '#f472b6'], // Red → Pink
      ['#9333ea', '#c084fc'], // Purple
      ['#f59e0b', '#fcd34d'], // Amber
      ['#0ea5e9', '#7dd3fc'], // Sky
    ];

    const datasets = allYears.map((year, idx) => ({
      label: `Sales ${year}`,
      data: months.map((month) => {
        const yearData = data.find((d) => d.period === year);
        return yearData?.months[month] || 0;
      }),
      backgroundColor: (ctx: import('chart.js').ScriptableContext<'bar'>) => {
        const chart = ctx.chart;
        const { ctx: canvasCtx, chartArea } = chart;

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

    return {
      labels: months,
      datasets,
    };
  }, [data]);

  React.useEffect(() => {
    if (error) {
      toast({
        description: 'Failed to load sales data. Please try again.',
        color: 'destructive', // Ganti color ke variant
      });
    }
  }, [error, toast]);

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm h-96'>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-md font-semibold'>
          Sales Comparison by Year in Millions (IDR)
        </h2>
        {/* <div className='flex items-center space-x-2'>
          <Switch
            id='chart-mode'
            checked={isFullWidth}
            onCheckedChange={handleModeChange}
          />
          <Label htmlFor='chart-mode'>
            {isFullWidth ? 'Full Width' : 'Half Width'}
          </Label>
        </div> */}
      </div>
      {isLoading || isFetching ? (
        <div className='text-center text-gray-500'>Loading...</div>
      ) : chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Total Sales' },
                ticks: {
                  callback: (value: unknown) => {
                    const val = Number(value) / 1000000;
                    return `${val.toLocaleString('id-ID')}`;
                  },
                },
              },
              x: {
                title: { display: false, text: 'Month' },
                grid: {
                  display: false,
                },
              },
            },
            plugins: {
              legend: { position: 'top' },
              title: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    ` ${(context.raw as number).toLocaleString('id-ID')}`,
                },
              },
            },
          }}
        />
      ) : (
        <div className='text-center text-red-500'>No data available</div>
      )}
    </div>
  );
};

export default SalesByPeriodChart;

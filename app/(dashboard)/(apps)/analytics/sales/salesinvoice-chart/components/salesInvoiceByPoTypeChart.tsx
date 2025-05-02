'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { hslToHex } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useSalesByPeriodAndPoType from '@/queryHooks/sls/dashboard/useSalesByPeriodAndPoType';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { months } from '@/utils/monthNameMap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  gradientPlugin
);

interface SalesInvoiceByPoTypeChartProps {
  height?: number;
  isCompact?: boolean;
  isFullWidth?: boolean;
  onModeChange?: (isFull: boolean) => void;
}

const SalesInvoiceByPoTypeChart: React.FC<SalesInvoiceByPoTypeChartProps> = ({
  height = 400,
  isCompact = false,
  isFullWidth,
  onModeChange,
}) => {
  const { theme: config, setTheme: setConfig } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const hslBackground = `hsla(${
    theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].background
  })`;
  const hexBackground = hslToHex(hslBackground);

  const { toast } = useToast();
  const { data, isLoading, isFetching, error } = useSalesByPeriodAndPoType();

  // Definisikan palet warna fixed berdasarkan poType dan period
  const colorMap: Record<
    string,
    { borderColor: string; backgroundColor: string }
  > = {
    Regular_2023: {
      borderColor: '#22C55E',
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
    }, // Green
    eCatalog_2023: {
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    }, // Blue
    Regular_2024: {
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
    }, // Red
    eCatalog_2024: {
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
    }, // Purple
    Regular_2025: {
      borderColor: '#EC4899',
      backgroundColor: 'rgba(236, 72, 153, 0.2)',
    }, // Pink
    eCatalog_2025: {
      borderColor: '#1E3A8A',
      backgroundColor: 'rgba(30, 58, 138, 0.2)',
    }, // Navy
  };

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return null;

    return {
      labels: months,
      datasets: data.map(
        (poTypeData: {
          poType: string;
          period: string;
          months: Record<string, number>;
        }) => {
          // Buat kunci untuk colorMap berdasarkan poType dan period
          const colorKey = `${poTypeData.poType}_${poTypeData.period}`;
          // Ambil warna dari colorMap, fallback ke warna default jika tidak ada
          const { borderColor, backgroundColor } = colorMap[colorKey] || {
            borderColor: '#6B7280', // Gray sebagai fallback
            backgroundColor: 'rgba(107, 114, 128, 0.2)',
          };

          return {
            label: `${poTypeData.poType} (${poTypeData.period})`,
            data: months.map((month) => poTypeData.months[month] || 0),
            borderColor,
            backgroundColor,
            tension: 0.4,
          };
        }
      ),
    };
  }, [data]);

  const maxValue = React.useMemo(() => {
    if (!chartData) return 0;
    return Math.max(...chartData.datasets.flatMap((ds) => ds.data));
  }, [chartData]);

  React.useEffect(() => {
    if (error) {
      toast({
        description:
          error.message ||
          'Failed to load sales by PO type data. Please try again.',
        color: 'destructive',
      });
    }
  }, [error, toast]);

  return (
    <div
      className={`chart-container ${isCompact ? 'compact' : ''} bg-white dark:bg-[#18181b] p-2 rounded-lg shadow-sm flex flex-col`}
      style={{ backgroundColor: hexBackground }}
    >
      <div className='relative flex items-center'>
        <h2 className='text-sm text-muted-foreground font-semibold ml-2'>
          Monthly Sales Invoice by PO Type (in Millions IDR)
        </h2>
        {!isCompact && ( // Hanya tampilkan switch jika isCompact = false
          <div className='absolute right-0 top-0 flex items-center text-muted-foreground text-xs space-x-2'>
            <Label htmlFor='chart-mode-potype'>
              {isFullWidth ? 'Full Width' : 'Half Width'}
            </Label>
            <Switch
              id='chart-mode-potype'
              checked={isFullWidth}
              onCheckedChange={(checked) => onModeChange?.(checked)}
              aria-label='Toggle full width chart'
            />
          </div>
        )}
      </div>

      {isLoading || isFetching ? (
        <div className='flex items-center justify-center h-full'>
          <div className='w-3/4 h-1/2 rounded-lg shimmer' />
        </div>
      ) : chartData ? (
        <div className='flex-1 h-full w-full min-h-0'>
          <Line
            data={chartData}
            width={isFullWidth ? 600 : 300}
            height={isCompact ? 250 : height}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  display: !isCompact,
                  maxHeight: 60,
                  labels: {
                    boxWidth: 15,
                    padding: 4,
                    font: {
                      size: 10,
                    },
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${context.dataset.label}: ${(context.raw as number).toLocaleString('id-ID')} IDR`,
                  },
                },
              },
              scales: {
                x: {
                  title: { display: false, text: 'Months' },
                  grid: {
                    display: true, // pastikan gridline X tampil
                    color: 'rgba(200,200,200,0.2)', // opsional: warna gridline
                  },
                },
                y: {
                  beginAtZero: true,
                  // min: maxValue < 1_000_000_000 ? 300_000_000 : undefined,
                  // max: maxValue * 1.1,
                  ticks: {
                    // stepSize:
                    //   maxValue < 1_000_000_000 ? 300_000_000 : 1_000_000_000,
                    maxTicksLimit: 5,
                    callback: (value) => {
                      const val = Number(value) / 1000000;
                      return `${val.toLocaleString('id-ID')}`;
                    },
                  },
                  grid: {
                    display: true, // pastikan gridline Y tampil
                    color: 'rgba(200,200,200,0.2)', // opsional: warna gridline
                  },
                },
              },
              layout: {
                padding: {
                  bottom: isCompact ? 2 : 5,
                  top: isCompact ? 2 : 5,
                },
              },
            }}
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

export default SalesInvoiceByPoTypeChart;

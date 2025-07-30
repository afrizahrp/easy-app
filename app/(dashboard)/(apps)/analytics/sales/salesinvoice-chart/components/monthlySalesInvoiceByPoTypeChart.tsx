'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import { motion } from 'framer-motion';
import { hslToHex } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import gradientPlugin from 'chartjs-plugin-gradient';
import { useToast } from '@/components/ui/use-toast';
import useMonthlySalesInvoiceByPoType from '@/queryHooks/analytics/sales/useMonthlySalesInvoiceByPoType';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

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

// Use 3-letter month names to match backend data format
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

interface MonthlySalesInvoiceByPoTypeChartProps {
  height?: number;
  isCompact?: boolean;
  isFullWidth?: boolean;
}

const MonthlySalesInvoiceByPoTypeChart: React.FC<
  MonthlySalesInvoiceByPoTypeChartProps
> = ({ height = 400, isCompact = false, isFullWidth = false }) => {
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const hslBackground = `hsla(${
    theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].background
  })`;
  const hexBackground = hslToHex(hslBackground);
  const { toast } = useToast();
  const { data, isLoading, isFetching, error } = useMonthlySalesInvoiceByPoType(
    {
      context: 'salesInvoice',
    }
  );

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = useCallback(() => {
    if (!chartContainerRef.current) return;

    if (!isFullScreen) {
      const requestFullscreen =
        chartContainerRef.current.requestFullscreen ||
        (
          chartContainerRef.current as HTMLElement & {
            webkitRequestFullscreen?: () => void;
          }
        ).webkitRequestFullscreen ||
        (
          chartContainerRef.current as HTMLElement & {
            mozRequestFullScreen?: () => void;
          }
        ).mozRequestFullScreen ||
        (
          chartContainerRef.current as HTMLElement & {
            msRequestFullscreen?: () => void;
          }
        ).msRequestFullscreen;

      if (requestFullscreen) {
        requestFullscreen.call(chartContainerRef.current);
      } else {
        setIsFullScreen(true);
      }
    } else {
      if (document.fullscreenElement) {
        const exitFullscreen =
          document.exitFullscreen ||
          (document as Document & { webkitExitFullscreen?: () => void })
            .webkitExitFullscreen ||
          (document as Document & { mozCancelFullScreen?: () => void })
            .mozCancelFullScreen ||
          (document as Document & { msExitFullscreen?: () => void })
            .msExitFullscreen;

        if (exitFullscreen) {
          exitFullscreen.call(document);
        }
      } else {
        setIsFullScreen(false);
      }
    }
    // Don't call onModeChange here since we're using internal fullscreen state
  }, [isFullScreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullScreen = !!document.fullscreenElement;
      setIsFullScreen(isNowFullScreen);
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
  }, []);

  const colorMap: Record<
    string,
    { borderColor: string; backgroundColor: string }
  > = {
    Regular_2022: {
      borderColor: '#22C55E',
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
    },
    eCatalog_2022: {
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },

    Regular_2023: {
      borderColor: '#22C55E',
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
    },
    eCatalog_2023: {
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
    Regular_2024: {
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    eCatalog_2024: {
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
    },
    Regular_2025: {
      borderColor: '#EC4899',
      backgroundColor: 'rgba(236, 72, 153, 0.2)',
    },
    eCatalog_2025: {
      borderColor: '#1E3A8A',
      backgroundColor: 'rgba(30, 58, 138, 0.2)',
    },
  };

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return null;

    return {
      labels: months,
      datasets: data.map((poTypeData) => {
        const colorKey = `${poTypeData.poType}_${poTypeData.period}`;
        const { borderColor, backgroundColor } = colorMap[colorKey] || {
          borderColor: '#6B7280',
          backgroundColor: 'rgba(107, 114, 128, 0.2)',
        };

        return {
          label: `${poTypeData.poType} (${poTypeData.period})`,
          data: months.map(
            (month) => (poTypeData.months[month]?.amount || 0) / 1_000_000
          ),
          growthPercentages: months.map(
            (month) => poTypeData.months[month]?.growthPercentage || 0
          ),
          borderColor,
          backgroundColor,
          tension: 0.4,
        };
      }),
    };
  }, [data]);

  React.useEffect(() => {
    if (error) {
      toast({
        description:
          error.message ||
          'Failed to load sales by PO type data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (chartContainerRef.current) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [isFullScreen]);

  return (
    <motion.div
      ref={chartContainerRef}
      className={`chart-container ${isCompact ? 'compact' : ''} ${
        isFullScreen && !document.fullscreenElement
          ? 'fixed inset-0 z-50 bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-md'
          : 'relative bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm'
      } flex flex-col h-fit min-h-[250px] w-full box-border`}
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
      <div className='relative flex items-center justify-between mb-2'>
        <h2 className='text-sm text-muted-foreground font-semibold ml-2'>
          Monthly Sales by PO Type (in Millions of IDR)
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
            <div className='w-3/4 h-1/2 rounded-lg shimmer' />
          </div>
        ) : chartData ? (
          <Line
            key={isFullWidth ? 'full' : 'half'}
            height={isFullScreen ? undefined : isCompact ? 250 : height}
            data={chartData}
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
                      size: isFullScreen ? 12 : 10,
                    },
                  },
                },
                tooltip: {
                  enabled: true,
                  position: 'nearest',
                  yAlign: 'top',
                  xAlign: 'left',
                  borderWidth: 1,
                  padding: 8,
                  bodyFont: { size: 12 },
                  callbacks: {
                    label: (context) => {
                      const amount = context.raw as number;
                      const growth = (context.dataset as any).growthPercentages[
                        context.dataIndex
                      ];
                      const icon = growth > 0 ? '🔼' : growth < 0 ? '🔻' : '➖';

                      return [
                        `${amount.toLocaleString('id-ID')} ${icon} ${growth.toFixed(2)}%`,
                      ];
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: { display: false, text: 'Months' },
                  grid: {
                    display: true,
                    color: 'rgba(200,200,200,0.2)',
                  },
                  ticks: {
                    callback: (value, index) => chartData.labels[index] ?? '',
                    font: {
                      size: isFullScreen ? 14 : 12,
                    },
                    align: 'center',
                    crossAlign: 'center',
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                    padding: 10,
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    maxTicksLimit: 5,
                    callback: (value) => {
                      const val = Number(value);
                      return `${val.toLocaleString('id-ID')}`;
                    },
                    font: {
                      size: isFullScreen ? 14 : 12,
                    },
                  },
                  grid: {
                    display: true,
                    color: 'rgba(200,200,200,0.2)',
                  },
                },
              },
              layout: {
                padding: {
                  bottom: isCompact ? 10 : 20,
                  top: isCompact ? 5 : 10,
                  left: 10,
                  right: 10,
                },
              },
            }}
          />
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-gray-400 p-12'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-24 h-24 mb-6 animate-bounce'
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
            <p className='text-sm font-medium mt-4'>No data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MonthlySalesInvoiceByPoTypeChart;

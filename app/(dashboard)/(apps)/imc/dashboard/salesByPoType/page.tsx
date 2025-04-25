// components/SalesByPoTypeAndPeriod.tsx
'use client';

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';
import {
  getGridConfig,
  getYAxisConfig,
  getLabel,
} from '@/lib/appex-chart-options';

type PoTypes = { [key: string]: number };

const rawData: { period: string; poTypes: PoTypes }[] = [
  {
    period: '2024',
    poTypes: {
      Regular: 33376993667,
      eCatalog: 26367583144,
    },
  },
  {
    period: '2025',
    poTypes: {
      Regular: 5566666057,
      eCatalog: 977587096,
    },
  },
];

// Extract unique poType keys
const poTypeKeys = Array.from(
  new Set(rawData.flatMap((item) => Object.keys(item.poTypes)))
);

// Categories (years)
const categories = rawData.map((item) => item.period);

// Format for ApexCharts series
const series = poTypeKeys.map((key) => ({
  name: key,
  data: rawData.map((item) => item.poTypes[key] || 0),
}));

const SalesByPoTypeAndPeriod = ({ height = 300 }: { height?: number }) => {
  const { theme: config, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();

  const theme = themes.find((t) => t.name === config);

  const options: any = {
    chart: {
      toolbar: {
        show: false,
      },
      stacked: true,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
    },
    colors: [
      `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].info})`,
      `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].success})`,
      `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].warning})`,
      `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].primary})`,
    ],
    tooltip: {
      theme: mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val: number) => val.toLocaleString('id-ID'),
      },
    },
    grid: getGridConfig(
      `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartGird})`
    ),
    yaxis: getYAxisConfig(
      `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartLabel})`
    ),
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 2,
      },
    },
    xaxis: {
      categories,
      labels: getLabel(
        `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].chartLabel})`
      ),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: false, // Hide default legend
    },
  };

  return (
    <div className='space-y-4'>
      <Chart
        options={options}
        series={series}
        type='bar'
        height={height}
        width='100%'
      />

      <div className='flex flex-wrap gap-4'>
        {series.map((item, index) => (
          <div key={item.name} className='flex items-center gap-2'>
            <div
              className='w-3 h-3 rounded-full'
              style={{
                backgroundColor: options.colors[index % options.colors.length],
              }}
            ></div>
            <span className='text-sm text-muted-foreground'>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesByPoTypeAndPeriod;

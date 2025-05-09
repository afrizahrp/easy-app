'use client';

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useTheme } from 'next-themes';
import { themes } from '@/config/thems';

interface CustomTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  invoice: string;
  growth: number;
  isFullScreen?: boolean;
  parentRef?: React.RefObject<HTMLElement>;
  isCompact?: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  visible,
  x,
  y,
  invoice,
  growth,
  isFullScreen = false,
  parentRef,
  isCompact = false,
}) => {
  console.log('CustomTooltip rendering:', { visible, x, y, isFullScreen });
  if (!visible) return null;

  const isUp = growth >= 0;
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  const tooltipContent = (
    <div
      className={cn(
        'absolute z-[100] rounded-md p-2 text-md shadow-md max-w-[200px]', // Tambahkan max-w untuk membatasi lebar
        'bg-gray-800 text-slate-100'
      )}
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div className='flex flex-col gap-1'>
        {' '}
        {/* Ubah ke flex-col untuk tata letak vertikal */}
        <span
          className={cn('block', isFullScreen ? 'text-[16px]' : 'text-[12px]')} // Gunakan block untuk teks
        >
          Sales {invoice}
        </span>
        <div className='flex items-center'>
          {' '}
          {/* Grup elemen growth secara horizontal */}
          <span
            className={cn(
              isUp ? 'text-green-400' : 'text-red-400',
              'mr-1 font-medium',
              isFullScreen ? 'text-[16px]' : 'text-[12px]'
            )}
          >
            {Math.abs(growth)}%
          </span>
          <Icon
            icon={
              isUp
                ? 'heroicons:arrow-trending-up-16-solid'
                : 'heroicons:arrow-trending-down-16-solid'
            }
            className={cn(
              isUp ? 'text-green-400' : 'text-red-400',
              'w-4 h-4 mr-1',
              isFullScreen ? 'text-[16px]' : 'text-[12px]'
            )}
          />
          <span className={cn(isFullScreen ? 'text-[16px]' : 'text-[12px]')}>
            vs previous year
          </span>
        </div>
        {/* Tambahkan ikon drill-down hanya jika !isCompact */}
        {!isCompact && (
          <div className='flex justify-start'>
            {' '}
            {/* Ikon drill-down di baris terpisah */}
            <Icon
              icon='heroicons:cursor-arrow-rays-16-solid'
              className={cn(
                'w-4 h-4 text-blue-400',
                isFullScreen ? 'text-[16px]' : 'text-[12px]'
              )}
            />
          </div>
        )}
      </div>
    </div>
  );

  return parentRef?.current
    ? createPortal(tooltipContent, parentRef.current)
    : createPortal(tooltipContent, document.body);
};

export default memo(CustomTooltip);

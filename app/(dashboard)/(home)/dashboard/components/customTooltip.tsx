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
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  visible,
  x,
  y,
  invoice,
  growth,
  isFullScreen = false,
}) => {
  if (!visible || !document.body) return null;

  const isUp = growth >= 0;
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  return createPortal(
    <div
      className={cn(
        'absolute z-50 rounded-md p-2 text-md shadow-md whitespace-nowrap',
        mode === 'dark'
          ? 'bg-gray-800 text-slate-100'
          : 'bg-white text-slate-900'
      )}
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div className='flex items-center'>
        <span
          className={cn('mr-2', isFullScreen ? 'text-[16px]' : 'text-[14px]')}
        >
          Sales {invoice},
        </span>
        <span
          className={cn(
            isUp ? 'text-green-400' : 'text-red-400',
            'mr-1 font-medium',
            isFullScreen ? 'text-[16px]' : 'text-[14px]'
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
            isFullScreen ? 'text-[16px]' : 'text-[14px]'
          )}
        />
        <span className={cn(isFullScreen ? 'text-[16px]' : 'text-[14px]')}>
          vs previous year
        </span>
      </div>
    </div>,
    document.body
  );
};

export default memo(CustomTooltip);

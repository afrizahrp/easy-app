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
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  visible,
  x,
  y,
  invoice,
  growth,
}) => {
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  if (!visible || !document.body) return null;

  const isUp = growth >= 0;

  return createPortal(
    <div
      className={cn(
        'absolute z-50 rounded-md p-2 text-sm shadow-md whitespace-nowrap',
        mode === 'dark'
          ? 'bg-gray-800 text-slate-100'
          : 'bg-white text-slate-900'
      )}
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div className='flex items-center'>
        <span className='mr-2'>Sales {invoice} ,</span>
        <span
          className={cn(isUp ? 'text-success' : 'text-destructive', 'mr-1')}
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
            isUp ? 'text-success' : 'text-destructive',
            'text-xl mr-1'
          )}
        />
        <span>vs previous year</span>
      </div>
    </div>,
    document.body
  );
};

export default memo(CustomTooltip);

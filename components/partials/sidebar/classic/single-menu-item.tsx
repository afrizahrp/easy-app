import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn, isLocationMatch, getDynamicPath } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const SingleMenuItem = ({
  item,
  collapsed,
  hovered,
}: {
  item: any;
  collapsed: boolean;
  hovered: boolean;
}) => {
  const { badge, href, title, icon: Icon } = item;
  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);
  const isActive = isLocationMatch(href, locationName);

  return (
    <Link href={href}>
      {!collapsed || hovered ? (
        <div
          className={cn(
            'flex gap-3 group text-default-700 dark:text-default-950 font-medium text-sm capitalize px-[10px] py-3 rounded cursor-pointer hover:bg-primary hover:text-primary-foreground',
            {
              'bg-primary text-primary-foreground active-item': isActive,
            }
          )}
        >
          <span className='flex-grow-0'>
            <Icon className='w-5 h-5' />
          </span>
          <div className='text-box flex-grow'>{title}</div>
          {badge && <Badge className='rounded'>{badge}</Badge>}
        </div>
      ) : (
        <div>
          <span
            className={cn(
              'h-12 w-12 mx-auto rounded-md transition-all duration-300 inline-flex flex-col items-center justify-center relative',
              {
                'bg-primary text-primary-foreground active-item': isActive,
                'text-default-600': !isActive,
              }
            )}
          >
            <Icon className='w-6 h-6' />
          </span>
        </div>
      )}
    </Link>
  );
};

export default SingleMenuItem;

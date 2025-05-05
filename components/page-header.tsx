'use client';
import React from 'react';
import { Label } from '@/components/ui/label';
import cn from '@/utils/class-names';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

export type PageHeaderTypes = {
  title: string;
  breadcrumb: { name: string; href?: string }[];
  className?: string;
  hideBreadcrumb?: boolean;
  disabled?: boolean;
};

export default function PageHeader({
  title,
  breadcrumb,
  children,
  className,
  hideBreadcrumb = false,
  disabled = false, // Ubah default ke false
}: React.PropsWithChildren<PageHeaderTypes>) {
  return (
    <header
      className={cn(
        'mb-2 mt-0',
        disabled && 'opacity-60 cursor-not-allowed', // Gaya saat disabled
        className
      )}
    >
      <div className='flex flex-col @lg:flex-row @lg:items-center @lg:justify-between'>
        <div>
          <Label
            className={cn(
              'w-1/2 mb-2 text-sm lg:text-lg 4xl:text-base dark:text-slate-400 text-slate-600',
              disabled && 'text-gray-500' // Ubah warna teks saat disabled
            )}
          >
            {title}
          </Label>
          {!hideBreadcrumb && breadcrumb.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {disabled || !item.href ? (
                        <span
                          className={cn(
                            'text-slate-600 dark:text-slate-400',
                            disabled && 'text-gray-500' // Gaya non-interaktif
                          )}
                        >
                          {item.name}
                        </span>
                      ) : (
                        <BreadcrumbLink href={item.href}>
                          {item.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumb.length - 1 && (
                      <BreadcrumbSeparator>
                        <ChevronRight size={14} />
                      </BreadcrumbSeparator>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        {children}
      </div>
    </header>
  );
}

// components/page-header.tsx
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
  hideBreadcrumb?: boolean; // Prop baru
  disabled?: boolean;
};

export default function PageHeader({
  title,
  breadcrumb,
  children,
  className,
  hideBreadcrumb = false,
  disabled = true,
}: React.PropsWithChildren<PageHeaderTypes>) {
  return (
    <header className={cn('mb-2 mt-0', className)}>
      <div className='flex flex-col @lg:flex-row @lg:items-center @lg:justify-between'>
        <div>
          <Label className='w-1/2 mb-2 text-sm lg:text-lg 4xl:text-base dark:text-slate-400 text-slate-600'>
            {title}
          </Label>
          {!hideBreadcrumb && breadcrumb.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={item.href}>
                        {item.name}
                      </BreadcrumbLink>
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

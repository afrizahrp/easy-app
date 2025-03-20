'use client';
import React, { Fragment } from 'react';
import { Label } from '@/components/ui/label';
import cn from '@/utils/class-names';
import { Slash } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function BreadcrumbWithCustomSeparator() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href='/components'>Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

import { ChevronRight } from 'lucide-react';

export type PageHeaderTypes = {
  title: string;
  // description: string;
  breadcrumb: { name: string; href?: string }[];
  className?: string;
};

export default function PageHeader({
  title,
  // description,
  breadcrumb,
  children,
  className,
}: React.PropsWithChildren<PageHeaderTypes>) {
  return (
    <>
      <header className={cn('mb-6 @container xs:-mt-2 lg:mb-7', className)}>
        <div className='flex flex-col @lg:flex-row @lg:items-center @lg:justify-between'>
          <div>
            <Label className='w-1/2 mb-2 text-[22px] lg:text-2xl 4xl:text-[26px]'>
              {title}
            </Label>
            {/* <Label className='mb-1 text-[22px] lg:text-2xl 4xl:text-[26px]'>
              {description}
            </Label> */}

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
          </div>
          {children}
        </div>
      </header>
    </>
  );
}

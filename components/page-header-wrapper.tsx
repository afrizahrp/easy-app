// components/page-header-wrapper.tsx
import React from 'react';
import PageHeader from '@/components/page-header';

interface PageHeaderWrapperProps {
  show?: boolean;
  title?: string;
  breadcrumb?: { name: string; href?: string }[];
  hideBreadcrumb?: boolean;
  disabled?: boolean;
}

export const PageHeaderWrapper: React.FC<PageHeaderWrapperProps> = ({
  show = true,
  title,
  breadcrumb = [],
  hideBreadcrumb = false,
  disabled = true,
}) => {
  if (!show) return null;
  return (
    <PageHeader
      title={title ?? ''}
      breadcrumb={breadcrumb}
      hideBreadcrumb={hideBreadcrumb}
    />
  );
};

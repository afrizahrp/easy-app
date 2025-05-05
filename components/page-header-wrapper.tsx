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
  disabled = false, // Ubah default ke false
}) => {
  if (!show) return null;
  return (
    <PageHeader
      title={title ?? ''}
      breadcrumb={breadcrumb}
      hideBreadcrumb={hideBreadcrumb}
      disabled={disabled} // Teruskan disabled ke PageHeader
    />
  );
};

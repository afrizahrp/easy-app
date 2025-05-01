import React from 'react';
import PageHeader from '@/components/page-header';

interface PageHeaderWrapperProps {
  show?: boolean;
  title?: string;
  breadcrumb?: { name: string; href?: string }[];
}

const PageHeaderWrapper: React.FC<PageHeaderWrapperProps> = ({
  show = true,
  title,
  breadcrumb = [],
}) => {
  if (!show) return null;
  return <PageHeader title={title ?? ''} breadcrumb={breadcrumb} />;
};

export default PageHeaderWrapper;

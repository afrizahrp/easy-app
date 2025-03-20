'use client';
import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { BillboardColumn, columns } from './columns';
import { routes } from '@/config/routes';
// import { Heading } from '@/components/ui/heading';
// import { Separator } from '@/components/ui/separator';
// import { ApiList } from '@/components/ui/api-list';
// import { useSession } from 'next-auth/react';

interface BillboardsClientProps {
  data: BillboardColumn[];
  currentPage: number;
  totalPages: number;
  totalRecords: number | undefined;
  onPageChange: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export const BillboardListTable: React.FC<BillboardsClientProps> = ({
  data,
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  limit,
  setLimit,
}) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        href={routes.cms.newBillboard}
        hrefText='New Billboard'
        pageName='billboard-web'
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        limit={limit}
        setLimit={setLimit}
      />
    </div>
  );
};

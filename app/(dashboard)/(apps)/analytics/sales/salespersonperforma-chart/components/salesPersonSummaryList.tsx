'use client';
import React from 'react';
import SalespersonSummaryCard from './SalespersonSummaryCard';
import { cn } from '@/lib/utils';

interface Salesperson {
  name: string;
}

interface SalesPersonSummaryListProps {
  salespersons: Salesperson[];
  year?: string;
}

const SalesPersonSummaryList: React.FC<SalesPersonSummaryListProps> = ({
  salespersons,
  year = '2024',
}) => {
  return (
    <div
      className={cn(
        salespersons.length === 1
          ? 'flex justify-center items-center min-h-screen'
          : 'flex flex-wrap gap-6 p-6'
      )}
    >
      {salespersons.map((sp) => (
        <SalespersonSummaryCard
          key={sp.name}
          salesPersonName={sp.name}
          year={year}
        />
      ))}
    </div>
  );
};

export default SalesPersonSummaryList;

'use client';
import React from 'react';
import SalespersonSummaryCard from './salesPersonSummaryCard';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    <motion.div
      className={cn(
        salespersons.length === 1
          ? 'flex justify-center items-center min-h-[300px] w-full'
          : 'grid grid-cols-1 md:grid-cols-2 gap-4 w-full'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {salespersons.map((sp) => (
        <motion.div
          key={sp.name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <SalespersonSummaryCard salesPersonName={sp.name} year={year} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SalesPersonSummaryList;

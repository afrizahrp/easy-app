'use client';
import React, { useState } from 'react';
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
  year,
}) => {
  const [selectedSalesperson, setSelectedSalesperson] = useState<string | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (salesPersonName: string) => {
    setSelectedSalesperson(salesPersonName);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSalesperson(null);
  };

  return (
    <motion.div
      className={cn(
        'max-w-5xl mx-auto w-full px-4 sm:px-6',
        salespersons.length === 1
          ? 'flex justify-center items-center min-h-[300px]'
          : salespersons.length === 2
            ? 'flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 min-h-[300px]'
            : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {salespersons.map((sp) => (
        <motion.div
          key={sp.name}
          className={cn(
            'h-full',
            salespersons.length === 2
              ? 'flex-1 max-w-xs sm:max-w-sm lg:max-w-md'
              : ''
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <SalespersonSummaryCard
            salesPersonName={sp.name}
            year={year}
            isDialogOpen={isDialogOpen && selectedSalesperson === sp.name}
            onOpenDialog={() => handleOpenDialog(sp.name)}
            onCloseDialog={handleCloseDialog}
            className='max-w-xs sm:max-w-sm lg:max-w-md h-full'
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SalesPersonSummaryList;

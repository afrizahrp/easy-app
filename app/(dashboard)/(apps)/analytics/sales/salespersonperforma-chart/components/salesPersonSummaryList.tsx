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
        'max-w-7xl mx-auto w-full',
        salespersons.length === 1
          ? 'flex justify-center items-center min-h-[300px]'
          : 'grid grid-cols-1 lg:grid-cols-2 gap-4'
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
          <SalespersonSummaryCard
            salesPersonName={sp.name}
            year={year}
            isDialogOpen={isDialogOpen && selectedSalesperson === sp.name}
            onOpenDialog={() => handleOpenDialog(sp.name)}
            onCloseDialog={handleCloseDialog}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SalesPersonSummaryList;

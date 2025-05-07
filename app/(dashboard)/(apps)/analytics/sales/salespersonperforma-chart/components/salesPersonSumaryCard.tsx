'use client';
import React, { useState } from 'react';
import useSalespersonFilteredSummary from '@/queryHooks/analytics/sales/useSalespersonFilteredSummary';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const SalespersonSummaryCard: React.FC<{ salesPersonName: string }> = ({
  salesPersonName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error } = useSalespersonFilteredSummary({
    salesPersonName,
    startPeriod: 'Jan2024',
    endPeriod: 'Dec2024',
  });

  if (isLoading)
    return <div className='animate-pulse bg-gray-200 h-48 w-full rounded-lg' />;
  if (error) return <div className='text-red-500'>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Card className='w-full max-w-sm hover:shadow-lg transition-shadow'>
        <CardHeader>
          <CardTitle>{data.salesPersonName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Period: {data.period}</p>
          <p>Total Invoice: {data.totalInvoice.toLocaleString()} IDR</p>
          <p>Growth: {data.growthPercentage}%</p>
          <p>
            Highest Month: {data.highestMonth.month} (
            {data.highestMonth.amount.toLocaleString()} IDR)
          </p>
          <p>
            Average Monthly: {data.averageMonthlySales.toLocaleString()} IDR
          </p>
        </CardContent>
        <CardFooter>
          <DialogTrigger asChild>
            <Button variant='outline' onClick={() => setIsOpen(true)}>
              View Details
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data.salesPersonName} Summary - {data.period}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>Total Invoice: {data.totalInvoice.toLocaleString()} IDR</p>
          <p>Previous Year: {data.previousYearInvoice.toLocaleString()} IDR</p>
          <p>Growth Percentage: {data.growthPercentage}%</p>
          <p>
            Highest Month: {data.highestMonth.month} -{' '}
            {data.highestMonth.amount.toLocaleString()} IDR
          </p>
          <p>
            Lowest Month: {data.lowestMonth.month} -{' '}
            {data.lowestMonth.amount.toLocaleString()} IDR
          </p>
          <p>
            Average Monthly Sales: {data.averageMonthlySales.toLocaleString()}{' '}
            IDR
          </p>
          <p>
            Target Suggestion: {data.targetSalesSuggestion.toLocaleString()} IDR
          </p>
          <h4 className='font-semibold mt-4'>Monthly Breakdown:</h4>
          <ul className='list-disc pl-5'>
            {data.months.map((monthData) => (
              <li key={monthData.month}>
                {monthData.month}: {monthData.amount.toLocaleString()} IDR
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={() => setIsOpen(false)} className='mt-4'>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SalespersonSummaryCard;

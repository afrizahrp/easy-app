// hooks/usePeriod.ts
import { useMonthYearPeriodStore } from '@/store';
import { format } from 'date-fns';

export function usePeriod() {
  const { startPeriod, endPeriod } = useMonthYearPeriodStore();

  const year = startPeriod ? format(startPeriod, 'yyyy') : undefined;
  const month = startPeriod ? format(startPeriod, 'MMM') : undefined;

  return { year, month, startPeriod, endPeriod };
}

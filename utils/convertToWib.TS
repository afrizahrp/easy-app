import { DateTime } from 'luxon';

export function ConvertToWib(date?: string | Date | null): string {
  const validDate = date ? new Date(date) : new Date(); // Pastikan selalu Date
  return (
    DateTime.fromJSDate(validDate, { zone: 'Asia/Jakarta' }) // Konversi ke WIB (UTC+7)
      .toISO() ?? ''
  ); // Format ke ISO 8601 with fallback to empty string
}

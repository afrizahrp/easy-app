export function DateTimeToWib(date: string | Date): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
}

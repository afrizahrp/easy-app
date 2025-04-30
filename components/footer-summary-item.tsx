type FooterSummaryItemProps = {
  label: string;
  value: string | number | null | undefined;
};

export const FooterSummaryItem = ({ label, value }: FooterSummaryItemProps) => (
  <div className='text-md font-semibold text-primary-foreground  dark:text-slate-400 text-right'>
    {label}:{' '}
    {typeof value === 'number' ? value.toLocaleString('id-ID') : (value ?? '-')}
  </div>
);

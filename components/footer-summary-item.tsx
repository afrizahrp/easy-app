type FooterSummaryItemProps = {
  label: string;
  value: string | number | null | undefined;
};

export const FooterSummaryItem = ({ label, value }: FooterSummaryItemProps) => (
  <div className='text-sm font-semibold text-muted-foreground text-right'>
    {label}:{' '}
    {typeof value === 'number' ? value.toLocaleString('id-ID') : (value ?? '-')}
  </div>
);

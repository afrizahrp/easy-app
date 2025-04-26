type FooterSummaryItemProps = {
  label: string;
  value: string | number | null | undefined;
};

export const FooterSummaryItem = ({ label, value }: FooterSummaryItemProps) => (
  <div className='text-md font-semibold text-black text-right'>
    {label}:{' '}
    {typeof value === 'number' ? value.toLocaleString('id-ID') : (value ?? '-')}
  </div>
);

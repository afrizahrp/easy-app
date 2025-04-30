type HeaderFilterItemProps = {
  label: string;
  value: string | number | null | undefined;
};

export const HeaderFilterItem = ({ label, value }: HeaderFilterItemProps) => (
  <div className='text-md font-semibold text-black text-right'>
    {label}:{' '}
    {typeof value === 'number' ? value.toLocaleString('id-ID') : (value ?? '-')}
  </div>
);

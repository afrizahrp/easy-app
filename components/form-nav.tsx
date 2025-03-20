import { Link } from 'react-scroll';
import cn from '@/utils/class-names';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export const formParts = {
  general: 'general',
  specs: 'specs',
};

export const menuItems = [
  {
    label: 'General Information',
    value: formParts.general,
  },
  {
    label: 'Specifications',
    value: formParts.specs,
  },
  // {
  //   label: 'Stock',
  //   value: formParts.productStock,
  // },
];

interface FormNavProps {
  className?: string;
}

export default function FormNav({ className }: FormNavProps) {
  return (
    <div
      className={cn(
        'z-100 sticky top-[64px] border-b border-gray-300 bg-white py-0 font-medium text-gray-500 @2xl:top-[72px] dark:bg-gray-50 2xl:top-20',
        className
      )}
    >
      {' '}
      <SimpleBar>
        <div className='inline-grid grid-flow-col gap-5 md:gap-7 lg:gap-10'>
          {menuItems.map((tab, idx) => (
            <Link
              key={tab.value}
              to={tab.value}
              spy={true}
              hashSpy={true}
              smooth={true}
              offset={idx === 0 ? -250 : -150}
              duration={500}
              className='relative cursor-pointer whitespace-nowrap py-4 hover:text-gray-1000'
              activeClass='active before:absolute text-lg before:bottom-0 before:left-0 before:z-[1] before:h-0.5 before:w-full before:bg-gray-1000 font-semibold text-gray-1000'
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </SimpleBar>
    </div>
  );
}

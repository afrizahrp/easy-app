import { useSidebar } from '@/store';
import { Pin } from 'lucide-react';

const SidebarToggle = () => {
  const { collapsed, setCollapsed } = useSidebar(); // Ambil state sidebar

  return (
    <button
      onClick={() => setCollapsed(!collapsed)} // Toggle state sidebar
      className={`h-6 w-6 flex items-center justify-center border-[1.5px] border-default-900 
        dark:border-default-200 rounded-full transition-all duration-150 
        ${collapsed ? '' : 'bg-blue-800 text-white dark:bg-default-300 dark:text-white'}`}
    >
      <Pin className='h-4 w-4 border-none' />
    </button>
  );
};

export default SidebarToggle;

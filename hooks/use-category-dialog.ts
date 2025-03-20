import { create } from 'zustand';
import { Category } from '@/types';

interface CategoryDialogStore {
  isOpen: boolean;
  isCms: boolean;
  data?: any;
  onOpen: (data: any, isCms: boolean) => void;
  onClose: () => void;
}

const useCategoryDialog = create<CategoryDialogStore>((set) => ({
  isOpen: false,
  isCms: false,
  data: undefined,
  onOpen: (data: Category, isCms: boolean = false) => {
    set({ isOpen: true, data, isCms });
  },
  onClose: () => set({ isOpen: false, isCms: false }), // Optionally reset isCms to false on close
}));

export default useCategoryDialog;

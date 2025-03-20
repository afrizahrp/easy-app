import { create } from 'zustand';
import { Products } from '@/types';

interface ProductDialogStore {
  isOpen: boolean;
  isCms: boolean;
  data?: any;
  onOpen: (data: any, isCms: boolean) => void;
  onClose: () => void;
}

const useProductDialog = create<ProductDialogStore>((set) => ({
  isOpen: false,
  isCms: false,
  data: undefined,
  onOpen: (data: Products, isCms: boolean = false) => {
    set({ isOpen: true, data, isCms });
  },
  onClose: () => set({ isOpen: false, isCms: false }), // Optionally reset isCms to false on close
}));

export default useProductDialog;

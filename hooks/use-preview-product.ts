import { create } from 'zustand';

import { Products } from '@/types';

interface PreviewModalStore {
  isOpen: boolean;
  data?: Products;
  onOpen: (data: Products) => void;
  onClose: () => void;
}

const usePreviewProduct = create<PreviewModalStore>((set) => ({
  isOpen: false,
  data: undefined,
  onOpen: (data: Products) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));

export default usePreviewProduct;

import { create } from 'zustand';
import { Products } from '@/types';

interface PreviewModalStore {
  isOpen: boolean;
  data?: any;
  onOpen: (data: any) => void;
  onClose: () => void;
}

const usePreviewModal = create<PreviewModalStore>((set) => ({
  isOpen: false,
  data: undefined,
  onOpen: (data: Products) => {
    // console.log('data from usePreview', data); // Log the data when onOpen is called
    set({ isOpen: true, data });
  },
  onClose: () => set({ isOpen: false }),
}));

export default usePreviewModal;

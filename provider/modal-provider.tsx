'use client';

import { useEffect, useState } from 'react';

import ProductDialog from '@/shared/dialogs/product-dialog';
import CategoryDialog from '@/shared/dialogs/category-dialog';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CategoryDialog />
      <ProductDialog />
    </>
  );
};

export default ModalProvider;

'use client';

import { Button } from '@/components/ui/button';
import useProductDialog from '@/hooks/use-product-dialog';
import { Pencil } from 'lucide-react';
import { ProductColumn } from './columns';
import { Products } from '@/types';

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const productDialog = useProductDialog();

  const onPreview = () => {
    const modifiedData: Products = {
      ...data,
      images: data.images.map((image) => ({
        id: '',
        product_id: data.id,
        imageURL: image,
        isPrimary: false,
        company_id: '',
        branch_id: '',
      })),
    };
    productDialog.onOpen(modifiedData, false);
  };

  return (
    <>
      <Button variant='ghost' className='h-8 w-8 p-0' onClick={onPreview}>
        <span className='sr-only text-center'>Open menu</span>
        <Pencil className='h-4 w-8 text-center' />
      </Button>
    </>
  );
};

'use client';

import Modal from '@/components/ui/modal';
import useProductDialog from '@/hooks/use-product-dialog';
import Gallery from '@/components/gallery/products';
import ProductFormQuickEdit from '@/shared/quick-edit/product-form-quick-edit';

const ProductDialog = () => {
  const { isCms } = useProductDialog();

  const productDialog = useProductDialog();
  const product = useProductDialog((state) => state.data);

  if (!product) {
    return null;
  }

  const imageExist = product.images.length;
  const orderedImages = [...product.images].sort((a, b) =>
    b.isPrimary ? 1 : -1
  );

  return (
    <Modal open={productDialog.isOpen} onClose={productDialog.onClose}>
      <div className='px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16'>
        <div
          className={`w-full pt-3 gap-12 ${imageExist === 0 ? 'w-full' : 'lg:w-1/2 lg:sticky h-max'}`}
        >
          <div className='text-lg font-semibold'>
            Catalog : {product?.catalog_id ? product.catalog_id : null}
          </div>

          <div>Id : {product?.id}</div>
          <div>
            <ProductFormQuickEdit isCms={isCms} data={product} />
          </div>
        </div>

        {/* {imageExist ? ( */}
        <div className='w-full flex flex-col gap-6 drop-shadow-md justify-center px-4'>
          <Gallery images={orderedImages} />
        </div>
        {/* ) : null} */}
        {/* (
          <div className='flex items-center justify-center'>
            No image available
          </div>
        )} */}
      </div>
    </Modal>
  );
};

export default ProductDialog;

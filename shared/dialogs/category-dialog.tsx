'use client';

import Modal from '@/components/ui/modal';
import useCategoryDialog from '@/hooks/use-category-dialog';
import Gallery from '@/components/gallery/products';
import CategoryFormQuickEdit from '@/shared/quick-edit/category-form-quick-edit';

const CategoryDialog = () => {
  const { isCms } = useCategoryDialog();
  const categoryDialog = useCategoryDialog();
  const category = useCategoryDialog((state) => state.data);

  if (!category) {
    return null;
  }

  return (
    <Modal open={categoryDialog.isOpen} onClose={categoryDialog.onClose}>
      <div className='px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16'>
        <div className='w-full lg:w-full lg:sticky pt-3 h-max'>
          {!isCms && <div>Type : {category?.categoryType}</div>}

          <div>Id : {category?.id}</div>
          <div>
            <CategoryFormQuickEdit isCms={isCms} data={category} />
          </div>
        </div>

        <div className='w-full flex flex-col gap-6 drop-shadow-md justify-center'>
          <Gallery images={category.images} />
        </div>
      </div>
    </Modal>
  );
};

export default CategoryDialog;

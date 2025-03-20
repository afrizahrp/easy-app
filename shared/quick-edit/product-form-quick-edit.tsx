'use client';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import useProductDialog from '@/hooks/use-product-dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { SearchColumnCategory } from '@/components/searchColumns';

import {
  ProductFormValues,
  productFormSchema,
} from '@/utils/schema/product.form.schema';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';
// import ProductNameExist from '@/components/nameExistChecking/inventory/productNameExist';

interface ProductFormQuickEditProps {
  isCms: boolean;
  data: any;
}

const ProductFormQuickEdit: React.FC<ProductFormQuickEditProps> = ({
  isCms,
  data,
}) => {
  const productDialog = useProductDialog();
  const [searchTerms, setSearchTerms] = useState('');

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const defaultValues = {
    ...data,
    iShowedStatus: data?.iShowedStatus,
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const onClosePreviewModal = (e: any) => {
    e.preventDefault();

    productDialog.onClose();
  };

  async function onSubmit(data: ProductFormValues): Promise<void> {
    try {
      setLoading(true);
      await axios.patch(`/api/inventory/products/${data.id}`, data);
      toast.success('Product has changed successfully.');
      productDialog.onClose();

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }
  const onProductNameChange = (newCategoryName: string) => {
    setSearchTerms(newCategoryName);
  };

  return (
    <div className='pt-3 space-x-2 flex items-center justify-end w-full'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-3 w-full'
        >
          <div className='w-full'>
            <div className='w-[400px] py-2 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading || isCms}
                        placeholder='Edit product name here'
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onProductNameChange(e.target.value); // Call the new handler
                        }}
                        className='font-bold w-full'
                      />
                    </FormControl>
                    {form.formState.errors.name && (
                      <FormMessage>
                        {form.formState.errors.name.message}
                      </FormMessage>
                    )}{' '}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='w-[300px] py-2 gap-4'>
              <FormField
                control={form.control}
                name='category_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    {!isCms ? (
                      <SearchColumnCategory
                        {...field}
                        currentValue={field.value ?? ''}
                        onChange={field.onChange}
                        disabled={loading || isCms}
                      />
                    ) : (
                      <FormControl>
                        <Input
                          {...field}
                          value={data.category.trim()}
                          onChange={field.onChange}
                          disabled
                        />
                      </FormControl>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* <div className='w-[300px] py-2 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Input
                      {...field}
                      value={data.category.trim()}
                      onChange={field.onChange}
                      disabled
                    />
                  </FormItem>
                )}
              />
            </div> */}

            <div className='py-2 gap-4'>
              <FormField
                control={form.control}
                name={isCms ? 'iShowedStatus' : 'iStatus'}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        style={{
                          backgroundColor: field.value ? 'green' : 'gray',
                        }}
                        disabled={loading}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>
                        {isCms ? (
                          field.value ? (
                            <span className='text-red text-semibold'>
                              Displayed in Website
                            </span>
                          ) : (
                            <span className='text-green'>
                              Not Displayed in Website{' '}
                            </span>
                          )
                        ) : field.value ? (
                          <span className='text-blue text-semibold'>
                            Active
                          </span>
                        ) : (
                          <span className='text-orange'>Non Active</span>
                        )}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='pt-6 space-x-2 items-start'>
            <Button
              onClick={onClosePreviewModal}
              className='ml-auto'
              variant='outline'
            >
              Cancel
            </Button>

            <Button
              disabled={loading}
              className='ml-auto'
              type='submit'
              onClick={(event) => {
                event.preventDefault(); // Prevent default if necessary
                const data = { ...form.getValues() };
                onSubmit(data);
              }}
            >
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductFormQuickEdit;

'use client';

import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Categories } from '@/types';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import {
  CategoryFormValues,
  categoryFormSchema,
} from '@/utils/schema/category.form.schema';
import useCategoryDialog from '@/hooks/use-category-dialog';

interface CategoryFormQuickEditProps {
  isCms?: boolean;
  data?: Categories;
}

const CategoryFormQuickEdit: React.FC<CategoryFormQuickEditProps> = ({
  isCms,
  data,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const categoryDialog = useCategoryDialog();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      ...data,
      id: data?.id ?? '',
      type: data?.type,
      name: data?.name ?? '',
      remarks: data?.remarks || undefined,
      iStatus: data?.iStatus,
      iShowedStatus: data?.iShowedStatus,
    },
  });

  const onClosePreviewModal = (e: any) => {
    e.preventDefault();
    categoryDialog.onClose();
  };

  async function onSubmit(data: CategoryFormValues): Promise<void> {
    try {
      setLoading(true);
      await axios.patch(`/api/inventory/categories/${data.id}`, data);
      toast.success('Category has changed successfully.');
      categoryDialog.onClose();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='w-[300px] py-2 gap-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading || isCms}
                        placeholder='Input category name'
                        {...field}
                        onChange={field.onChange}
                        className='font-bold'
                      />
                    </FormControl>
                    {form.formState.errors.name && (
                      <FormMessage>
                        {form.formState.errors.name.message}
                      </FormMessage>
                    )}
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
          </div>
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
                        <span className='text-blue text-semibold'>Active</span>
                      ) : (
                        <span className='text-orange'>Non Active</span>
                      )}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
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
    </>
  );
};
export default CategoryFormQuickEdit;

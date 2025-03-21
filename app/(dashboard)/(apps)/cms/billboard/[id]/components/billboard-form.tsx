'use client';

import { useUpdateBillboard } from '@/queryHooks/useUpdateBillboard';
import { useCreateBillboard } from '@/queryHooks/useCreateBillboard';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormFooter from '@/components/form-footer';
// import 'easymde/dist/easymde.min.css';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import BillboardVideoUpload from '@/components/ui/billboard-video-upload';
import SingleFileUploader from '@/components/ui/singleFileUploader';

import { Checkbox } from '@/components/ui/checkbox';
import { Billboard } from '@/types';
import {
  BillboardFormValues,
  billboardFormSchema,
} from '@/utils/schema/billboard.form.schema';
import { billboarddefaultValues } from '@/utils/defaultvalues/billboard.defaultValue';
import { Switch } from '@/components/ui/switch';

import { useSessionStore } from '@/store';
import dynamic from 'next/dynamic';

import QuillLoader from '@/components/ui/quill-loader';
const QuillEditor = dynamic(() => import('@/components/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className='col-span-full h-[143px]' />,
});
// import BillboardImageUpload from '@/components/ui/billboard-image-upload';

interface BillboardFormProps {
  initialBillboardData: Billboard | undefined;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialBillboardData,
}) => {
  const user = useSessionStore((state) => state.user);
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const company_id = user?.company_id;

  const actionMessage = initialBillboardData
    ? 'Billboard has changed successfully.'
    : 'New Billboard has been added successfully.';

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(billboardFormSchema),
    defaultValues: billboarddefaultValues(initialBillboardData),
  });

  const handleBack = (e: any) => {
    e.preventDefault();
    setLoading(false);
    router.push('/cms/billboard/list');
  };

  const id = initialBillboardData?.id ?? 0;
  const createBillboardMutation = useCreateBillboard();
  const updateBillboardMutation = useUpdateBillboard();

  function extractPublicIdFromCloudinaryUrl(url: string): string {
    const parts = url.split('/');
    const filename = parts.pop(); // Ambil bagian terakhir dari URL
    if (!filename) return ''; // Jika tidak ada, return string kosong
    return filename.split('.')[0]; // Ambil nama file tanpa ekstensi
  }

  const handleCreateBillboard = () => {
    console.log('handleCreateBillboard called'); // Log ini untuk memastikan fungsi dipanggil

    const contentId = extractPublicIdFromCloudinaryUrl(
      form.getValues().contentURL as string
    );
    const newData = {
      ...form.getValues(),
      id: undefined,
      name: form.getValues().name ?? '',
      contentURL: form.getValues().contentURL ?? '',
      content_id: contentId ?? '',
      section: form.getValues().section ?? 0,
      iStatus: form.getValues().iStatus ?? 'ACTIVE',
      iShowedStatus: form.getValues().iShowedStatus ?? 'SHOW',
      remarks: form.getValues().remarks ?? '',
      isImage: form.getValues().isImage ?? true,
      company_id: company_id ?? '',
      branch_id: user?.company_id ?? '',
      updatedBy: user?.name ?? '',
      createdBy: user?.name ?? '',
    };

    // console.log('New Billboard Data:', newData); // Log untuk melihat data yang dikirimkan

    createBillboardMutation.mutate(
      { data: newData },
      {
        onSuccess: () => {
          toast.success(actionMessage);
          // router.push('/cms/billboard/list');
        },
        onError: (error: any) => {
          console.error('Creation failed:', error);
          const errorMessage =
            error.response?.data?.message || 'Creation failed';
          toast.error('Creation failed');
        },
      }
    );
  };

  const handleUpdateBillboard = (id: number) => {
    const contentId = extractPublicIdFromCloudinaryUrl(
      form.getValues().contentURL as string
    );
    const updatedData = {
      id: id,
      data: {
        ...form.getValues(),
        name: form.getValues().name ?? '',
        contentURL: form.getValues().contentURL ?? '',
        content_id: contentId ?? '',
        section: form.getValues().section ?? 0,
        iStatus: form.getValues().iStatus ?? 'ACTIVE',
        iShowedStatus: form.getValues().iShowedStatus ?? 'SHOW',
        remarks: form.getValues().remarks ?? '',
        isImage: form.getValues().isImage ?? true,
        company_id: company_id ?? '',
        branch_id: user?.company_id ?? '',
        updatedBy: user?.name ?? '',
        updatedAt: new Date(),
      },
    };
    updateBillboardMutation.mutate(updatedData, {
      onSuccess: () => {
        toast.success(actionMessage);
        router.refresh();
      },
      onError: (error) => {
        console.error('Update failed:', error);
        toast.error('Update failed');
      },
    });
    console.log('Data yang dikirim:', updatedData); // Debugging
  };

  // console.log('initialBillboardData', initialBillboardData);

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      console.log('onSubmit called with data:', data);

      if (initialBillboardData) {
        handleUpdateBillboard(id);
      } else {
        console.log('Creating new billboard...');

        await handleCreateBillboard();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageRemove = async (id: number) => {
    try {
      setLoading(true);

      const contentURL = form.getValues().contentURL as string;
      form.setValue('contentURL', '');
      form.setValue('content_id', '');
      handleUpdateBillboard(id);
      router.refresh();
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  const isImageValue = form.watch('isImage');

  const UploadComponent = isImageValue
    ? SingleFileUploader
    : BillboardVideoUpload;

  const billboard_id = initialBillboardData?.id?.toString() ?? '';
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='w-full flex items-center justify-center'>
            <div className='w-full max-w-md'>
              <FormField
                control={form.control}
                name='contentURL'
                render={({ field }) => (
                  <FormItem>
                    {/* <FormControl className='flex flex-col items-center gap-2'> */}
                    <FormControl className='w-full'>
                      <UploadComponent
                        value={field.value ? [field.value] : []}
                        disabled={loading}
                        onChange={(url) => field.onChange(url)}
                        onRemove={(contentURL) => {
                          if (billboard_id) {
                            handleImageRemove(id);
                          }
                          const newValue = Array.isArray(field.value)
                            ? field.value.filter(
                                (value: { contentURL: string }) =>
                                  value.contentURL !== contentURL
                              )
                            : [];
                          field.onChange(newValue);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* <Separator /> */}

          <div className='mt-0'>
            <FormField
              control={form.control}
              name='isImage'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>
                      {field.value ? (
                        <span className='text-red text-semibold'>
                          Show billboard as Image
                        </span>
                      ) : (
                        <span className='text-green'>
                          Show billboard as Video
                        </span>
                      )}
                    </FormLabel>
                    <FormDescription>
                      {field.value ? (
                        <span className='text-white'>
                          Billboard will be shown as image
                        </span>
                      ) : (
                        <span className='text-black'>
                          Billboard will be shown as video
                        </span>
                      )}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-12 gap-4 py-2'>
            <div className='col-span-1'>
              <FormField
                control={form.control}
                name='section'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        max={7}
                        placeholder='Input billboard section here'
                        value={field.value ?? 1}
                        onChange={(e) => field.onChange(Number(e.target.value))} // 🔥 Paksa jadi number
                        className='text-right justify-end'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-8'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Input billboard title here'
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                    {form.formState.errors.name && (
                      <FormMessage>
                        {form.formState.errors.name.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <FormField
              control={form.control}
              name='remarks'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 dark:text-gray-300'>
                    Descriptions
                  </FormLabel>
                  <FormControl>
                    <QuillEditor
                      value={field.value || ''}
                      onChange={(value) => field.onChange(value)}
                      placeholder='Input or edit description here'
                      className='col-span-full [&_.ql-editor]:min-h-[100px] dark:[&_.ql-editor]:bg-gray-800 dark:[&_.ql-editor]:text-gray-200 dark:[&_.ql-editor]:border-gray-700'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='iStatus'
            render={({ field }) => (
              <FormItem
                className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 justify-self-end ${
                  field.value
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-400 text-black'
                }`}
              >
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    // @ts-ignore
                    onCheckedChange={field.onChange}
                    // disabled={loading}
                    style={{
                      backgroundColor: field.value ? 'green' : 'gray',
                    }}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>
                    {field.value ? (
                      <span className='text-red text-semibold'>Active</span>
                    ) : (
                      <span className='text-green'>Non Active</span>
                    )}
                  </FormLabel>
                  <FormDescription>
                    {field.value ? (
                      <span className='text-white'>
                        This billboard will be shown in the website
                      </span>
                    ) : (
                      <span className='text-black'>
                        This billboard will not be shown in the website
                      </span>
                    )}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <div>
            <FormField
              control={form.control}
              name='iShowedStatus'
              render={({ field }) => (
                <FormItem
                  className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 justify-self-end ${
                    field.value
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-400 text-black'
                  }`}
                >
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                      // disabled={loading}
                      style={{
                        backgroundColor: field.value ? 'green' : 'gray',
                      }}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>
                      {field.value ? (
                        <span className='text-red text-semibold'>
                          Displayed in the website
                        </span>
                      ) : (
                        <span className='text-green'>
                          Not displayed in the website
                        </span>
                      )}{' '}
                    </FormLabel>
                    <FormDescription>
                      {field.value ? (
                        <span className='text-white'>
                          This billboard will be shown in the website
                        </span>
                      ) : (
                        <span className='text-black'>
                          This billboard will not be shown in the website
                        </span>
                      )}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormFooter
              isLoading={loading}
              handleAltBtn={handleBack}
              submitBtnText={id ? 'Update' : 'Save'}
            />
          </div>
        </form>
      </Form>
    </>
  );
};

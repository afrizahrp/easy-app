'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormFooter from '@/components/form-footer';
import { toast } from 'react-hot-toast';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css'; // Don't forget to import the CSS

import {
  Products,
  SubCategories,
  Categories,
  Brands,
  Uoms,
} from '@prisma/client';

// import {
//   MaterialCategories,
//   Materials,
//   SubCategories,
//   Brands,
//   Uoms,
// } from '@/types';

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import MaterialNameExist from '@/components/nameExistChecking/inventory/materialNameExist';
import {
  SearchColumnMaterialCategory,
  SearchColumnUom,
  SearchColumnBrand,
} from '@/components/searchColumns';

import { Switch } from '@/components/ui/switch';
// import { Checkbox } from '@/components/ui/checkbox';
import {
  MaterialProductFormValues,
  materialproductFormSchema,
} from '@/utils/schema/materialproduct.form.schema';

import { productdefaultValues } from '@/utils/defaultvalues/product.defaultValues';

interface MaterialFormProps {
  initialProductData: Products | null;
  subCategories: SubCategories[];
  categories: Categories[] | null;
  brands: Brands[];
  uoms: Uoms[];
}

export const MaterialForm: React.FC<MaterialFormProps> = ({
  initialProductData,
  categories,
  brands,
  uoms,
  subCategories,
}) => {
  const params = useParams();
  const router = useRouter();
  const [searchTerms, setSearchTerms] = useState('');
  const [loading, setLoading] = useState(false);
  const id = initialProductData?.id;

  const actiomMessage = initialProductData
    ? 'Raw material has changed successfully.'
    : 'New raw material has been added successfully.';
  const action = initialProductData ? 'Save Changes' : 'Save New raw material';

  // const form = useForm<MaterialProductFormValues>({
  //   resolver: zodResolver(materialproductFormSchema),
  //   defaultValues: {
  //     ...initialProductData,
  //     id: initialProductData?.id,
  //     catalog_id: initialProductData?.catalog_id ?? '',
  //     registered_id: initialProductData?.registered_id ?? '',
  //     name: initialProductData?.name ?? '',
  //     category_id: initialProductData?.category_id ?? '',
  //     subCategory_id: initialProductData?.subCategory_id ?? '',
  //     brand_id: initialProductData?.brand_id ?? '',
  //     uom_id: initialProductData?.uom_id ?? '',
  //     iStatus: initialProductData?.iStatus ?? true,
  //     remarks: initialProductData?.remarks ?? '',
  //     isMaterial: initialProductData?.isMaterial ?? true,
  //     slug: initialProductData?.slug ?? '',
  //     ecatalog_URL: initialProductData?.ecatalog_URL ?? '',
  //   },
  // });

  const form = useForm<MaterialProductFormValues>({
    resolver: zodResolver(materialproductFormSchema),
    defaultValues: productdefaultValues(
      initialProductData ?? {
        id: '',
        catalog_id: '',
        registered_id: '',
        name: '',
        category_id: '',
        uom_id: 'UNIT',
        brand_id: '1457',
        tkdn_pctg: 0,
        bmp_pctg: 0,
        ecatalog_URL: '',
        iStatus: true,
        remarks: '',
        slug: '',
        isMaterial: true,
        iShowedStatus: false,
      }
    ),
  });

  const handleBack = (e: any) => {
    e.preventDefault();
    setLoading(false);
    router.push('/inventory/materials/material-list');
  };

  const onSubmit = async (data: MaterialProductFormValues) => {
    try {
      setLoading(true);
      if (initialProductData) {
        await axios.patch(`/api/inventory/materials/${params?.id}`, data);
      } else {
        await axios.post(`/api/inventory/materials`, data);
      }
      router.push('/inventory/materials/material-list');
      router.refresh();
      toast.success(actiomMessage);
    } catch (error: any) {
      console.error(error);

      toast.error(error.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoryId = form.watch('category_id');

  useEffect(() => {
    const selectedSubCategory = form.watch('subCategory_id');
    const subCategoryBelongsToCategory =
      subCategories &&
      subCategories.some(
        (subCategory) =>
          subCategory.id === selectedSubCategory &&
          subCategory.category_id === selectedCategoryId
      );

    if (!subCategoryBelongsToCategory) {
      form.setValue('subCategory_id', '');
    }
  }, [selectedCategoryId, form.setValue, form.watch, subCategories]);

  const onMaterialNameChange = (newCategoryName: string) => {
    setSearchTerms(newCategoryName);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='grid grid-cols-2 gap-4 py-2'>
            <div>
              <FormField
                control={form.control}
                name='id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Id</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder='Id'
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='w-3/4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder='Input material name here'
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onMaterialNameChange(e.target.value); // Call the new handler
                        }}
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

            <MaterialNameExist
              currentValue={searchTerms}
              onChange={onMaterialNameChange}
            />
          </div>

          <div className='grid grid-cols-4 gap-4 py-2'>
            <div>
              <FormField
                control={form.control}
                name='category_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <SearchColumnMaterialCategory
                      {...field}
                      currentValue={field.value ?? ''}
                      onChange={field.onChange}
                      disabled={loading}
                    />

                    {/* Pass the field object to SelectCombo if needed */}
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name='category_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value ?? ''}
                            placeholder='Select a category'
                          />
                        </SelectTrigger>
                      </FormControl>
                      {form.formState.errors.category_id && (
                        <FormMessage>
                          {form.formState.errors.category_id.message}
                        </FormMessage>
                      )}{' '}
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              /> */}
            </div>

            <div>
              <FormField
                control={form.control}
                name='subCategory_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                      defaultValue={field.value ?? ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value ?? ''}
                            placeholder='Subcategory'
                          />
                        </SelectTrigger>
                      </FormControl>
                      {form.formState.errors.subCategory_id && (
                        <FormMessage>
                          {form.formState.errors.subCategory_id.message}
                        </FormMessage>
                      )}{' '}
                      <SelectContent>
                        {subCategories
                          ?.filter(
                            (subCategory: SubCategories) =>
                              subCategory.category_id === selectedCategoryId
                          )
                          .map((subCategory: SubCategories) => (
                            <SelectItem
                              key={subCategory.id}
                              value={subCategory.id}
                            >
                              {subCategory.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div>
              {/* <FormField
                control={form.control}
                name='uom_id'
                render={({ field }) => (
                  <div>
                    <FormItem>
                      <FormControl>
                        <SearchColumnUoms field={field.value} />
                      </FormControl>
                      {form.formState.errors.uom_id && (
                        <FormMessage>
                          {form.formState.errors.uom_id.message}
                        </FormMessage>
                      )}
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name='uom_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uom</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                      defaultValue={field.value ?? ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value ?? ''}
                            placeholder='Uom'
                          />
                        </SelectTrigger>
                      </FormControl>
                      {form.formState.errors.uom_id && (
                        <FormMessage>
                          {form.formState.errors.uom_id.message}
                        </FormMessage>
                      )}{' '}
                      <SelectContent>
                        {uoms.map((uom) => (
                          <SelectItem key={uom.id} value={uom.id}>
                            {uom.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name='uom_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uom</FormLabel>
                    <SearchColumnUom
                      {...field}
                      currentValue={field.value ?? ''}
                      // value={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                    />

                    {/* Pass the field object to SelectCombo if needed */}
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name='brand_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brands</FormLabel>
                    <SearchColumnBrand
                      {...field}
                      currentValue={field.value ?? ''}
                      // value={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                    />

                    {/* Pass the field object to SelectCombo if needed */}
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
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <SimpleMDE
                      disabled={loading}
                      placeholder='Type here to add remarks'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                      )}{' '}
                    </FormLabel>
                    <FormDescription>
                      {field.value ? (
                        <span className='text-white'>
                          This material will be shown during transaction input
                        </span>
                      ) : (
                        <span className='text-black'>
                          This material will not be shown during transaction
                          input
                        </span>
                      )}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormFooter
            isLoading={loading}
            handleAltBtn={handleBack}
            submitBtnText={id ? 'Update' : 'Save'}
          />
        </form>
      </Form>
      {/* </FormGroup> */}
    </>
  );
};

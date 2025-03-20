'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import FormFooter from '@/components/form-footer'
import 'easymde/dist/easymde.min.css' // Don't forget to import the CSS
import { toast } from 'react-hot-toast'

import { Products, SubCategories, ProductImages, Categories, Brands, Uoms } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import ProductNameExist from '@/components/nameExistChecking/inventory/productNameExist'
import {
  // SearchColumnProductCategory,
  SearchColumnCategory,
  SearchColumnUom,
  SearchColumnBrand
} from '@/components/searchColumns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Separator } from '@/components/ui/separator'
import { ProductFormValues, productFormSchema } from '@/utils/schema/product.form.schema'

import { productdefaultValues } from '@/utils/defaultvalues/product.defaultValues'

import { Switch } from '@/components/ui/switch'
import ProductImageForm from '../../../../cms/products/[id]/components/productImage-form'
import ImageCollection from '@/components/ui/images-collection'
// import { Checkbox } from '@/components/ui/checkbox';
// import ImageUpload from '@/components/ui/image-upload';
// import { routes } from '@/config/routes';

interface ProductFormProps {
  initialProductData:
    | (Products & {
        images: ProductImages[]
      })
    | null
  categories: Categories[]
  subCategories: SubCategories[]
  brands: Brands[]
  uoms: Uoms[]
}

// Fungsi untuk memformat angka dengan pemisah ribuan
const formatNumber = (value: string) => {
  // Mengonversi string ke angka dan memformatnya dengan pemisah ribuan
  const numberValue = parseFloat(value.replace(/\./g, '').replace(',', '.'))
  if (isNaN(numberValue)) return ''
  return new Intl.NumberFormat('id-ID').format(numberValue)
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProductData,
  subCategories,
  categories,
  brands,
  uoms
}) => {
  const params = useParams()
  const router = useRouter()

  const [searchTerms, setSearchTerms] = useState('')
  const [loading, setLoading] = useState(false)
  const id = initialProductData?.id

  const actionMessage = initialProductData
    ? 'Product has changed successfully.'
    : 'New Product has been added successfully.'

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: productdefaultValues(
      initialProductData
        ? {
            ...initialProductData,
            sellingPrice: Number(initialProductData.sellingPrice)
          }
        : {
            id: '',
            name: '',
            category_id: '',
            subCategory_id: '',
            brand_id: '',
            qty: 10,
            sellingPrice: 1000,
            uom_id: '',
            iStatus: true,
            slug: '',
            isMaterial: false,
            iShowedStatus: false
          }
    )
  })

  const handleBack = (e: any) => {
    e.preventDefault()
    setLoading(false)
    router.push('/inventory/products/product-list')
  }

  const onSubmit = async (data: ProductFormValues) => {
    console.log('Data yang dikirim:', data) // Debugging untuk memastikan semua data terkirim

    try {
      setLoading(true)
      if (initialProductData) {
        await axios.patch(`/api/inventory/products/${params?.id}`, data)
      } else {
        // console.log('add new product', data);
        await axios.post(`/api/inventory/products`, data)
      }
      router.push('/inventory/products/product-list')
      router.refresh()
      toast.success(actionMessage)
    } catch (error: any) {
      console.error(error)

      toast.error(error.response?.data?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  const selectedCategoryId = form.watch('category_id')

  useEffect(() => {
    const selectedSubCategory = form.watch('subCategory_id')
    const subCategoryBelongsToCategory =
      subCategories &&
      subCategories.some(
        subCategory => subCategory.id === selectedSubCategory && subCategory.category_id === selectedCategoryId
      )

    if (!subCategoryBelongsToCategory) {
      form.setValue('subCategory_id', '')
    }
  }, [selectedCategoryId, form.setValue, form.watch, subCategories])

  const onProductNameChange = (newCategoryName: string) => {
    setSearchTerms(newCategoryName)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-2'>
              <FormField
                control={form.control}
                name='id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Id</FormLabel>
                    <FormControl>
                      <Input
                        className='border-gray-300 text-gray-700'
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

            <div className='col-span-3'>
              <FormField
                control={form.control}
                name='category_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Category</FormLabel>
                    <SearchColumnCategory
                      {...field}
                      currentValue={field.value ?? ''}
                      onChange={field.onChange}
                      disabled={loading}
                    />
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-3'>
              <FormField
                control={form.control}
                name='subCategory_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>SubCategory</FormLabel>
                    <Select
                      disabled={loading}
                      value={field.value ?? ''}
                      defaultValue={field.value ?? ''}
                      onValueChange={value => {
                        field.onChange(value) // Memperbarui nilai di react-hook-form
                        console.log('Selected SubCategory ID:', value) // Mendapatkan ID subkategori yang dipilih
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='SubCategory' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subCategories
                          ?.filter(sub => sub.category_id === selectedCategoryId)
                          .map(sub => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-3'>
              <FormField
                control={form.control}
                name='brand_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Brand</FormLabel>
                    <SearchColumnBrand
                      {...field}
                      currentValue={field.value ?? ''}
                      onChange={field.onChange}
                      disabled={loading}
                    />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='grid grid-cols-12 gap-4 mt-6'>
            {/* Product Name */}
            <div className='col-span-8'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter Product Name'
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        className='border-gray-300 text-gray-700'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Quantity (Qty) */}
            <div className='col-span-2'>
              <FormField
                control={form.control}
                name='qty'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Qty</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter Qty'
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        className='border-gray-300 text-gray-700'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* UOM (Unit of Measurement) */}
            <div className='col-span-2'>
              <FormField
                control={form.control}
                name='uom_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Uom</FormLabel>
                    <SearchColumnUom
                      {...field}
                      currentValue={field.value ?? ''}
                      onChange={field.onChange}
                      disabled={loading}
                    />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <FormField
              control={form.control}
              name='iStatus'
              render={({ field }) => (
                <FormItem
                  className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 justify-self-end ${
                    field.value ? 'bg-green-600 text-white' : 'bg-slate-400 text-black'
                  }`}
                >
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                      // disabled={loading}
                      style={{
                        backgroundColor: field.value ? 'green' : 'gray'
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
                        <span className='text-white'>This product will be shown during transaction input</span>
                      ) : (
                        <span className='text-black'>This product will not be shown during transaction input</span>
                      )}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormFooter isLoading={loading} handleAltBtn={handleBack} submitBtnText={id ? 'Update' : 'Save'} />
        </form>
      </Form>
    </>
  )
}

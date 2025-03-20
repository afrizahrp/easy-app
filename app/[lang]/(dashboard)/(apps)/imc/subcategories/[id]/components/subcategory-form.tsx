'use client'
import axios from 'axios'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { toast } from 'react-hot-toast'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css' // Don't forget to import the CSS

import { SubCategories } from '@prisma/client'

import SubCategoryNameExist from '@/components/nameExistChecking/inventory/subCategoryNameExist'

import { useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormFooter from '@/components/form-footer'

import { Switch } from '@/components/ui/switch'

import { SearchColumnCategory } from '@/components/searchColumns'

import { SubCategoryFormValues, subCategoryFormSchema } from '@/utils/schema/subcategory.form.schema'
// import { defaultValues } from '@/utils/defaultvalues/category.defaultValues';
// import CategoryNameExist from '@/components/nameExistChecking/inventory/categoryNameExist';
// import { Checkbox } from '@/components/ui/checkbox';

interface SubcategoryFormProps {
  initialData?: SubCategories
}

export const SubCategoryForm: React.FC<SubcategoryFormProps> = ({ initialData }) => {
  const params = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [searchTerms, setSearchTerms] = useState('')
  // const [categoryType, setCategoryType] = useState('0');

  const id = initialData?.id

  const actionMessage = initialData
    ? 'Subcategory has changed successfully.'
    : 'New Subcategory has been added successfully.'

  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategoryFormSchema),
    defaultValues: {
      ...initialData,
      id: initialData?.id,
      name: initialData?.name || undefined,
      remarks: initialData?.remarks || undefined,
      iStatus: initialData?.iStatus ?? true
    }
  })

  const handleBack = (e: any) => {
    e.preventDefault()
    setLoading(false)
    router.push('/inventory/subcategories/subcategory-list')
  }

  const onSubmit = async (data: SubCategoryFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/inventory/subCategories/${params?.id}`, data)
      } else {
        await axios.post(`/api/inventory/subCategories`, data)
      }
      router.push('/inventory/subcategories/subcategory-list')
      router.refresh()
      toast.success(actionMessage)
    } catch (error: any) {
      console.error(error)

      toast.error(error.response?.data?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  const onSubCategoryNameChange = (newSubCategoryName: string) => {
    setSearchTerms(newSubCategoryName)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <div className='grid grid-cols-4 gap-4 py-2'>
            <div>
              <FormField
                control={form.control}
                name={'id'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Id</FormLabel>
                    <FormControl>
                      <Input disabled placeholder='id' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name='category_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
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
                        placeholder='Input subcategory name'
                        {...field}
                        onChange={e => {
                          field.onChange(e)
                          onSubCategoryNameChange(e.target.value) // Call the new handler
                        }}
                        className='font-bold'
                      />
                    </FormControl>
                    {form.formState.errors.name && <FormMessage>{form.formState.errors.name.message}</FormMessage>}
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <SubCategoryNameExist currentValue={searchTerms} onChange={onSubCategoryNameChange} />
          </div>

          <div>
            <FormField
              control={form.control}
              name='remarks'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <SimpleMDE placeholder='Type here to add remarks' disabled={loading} {...field} />
                  </FormControl>
                  {form.formState.errors.name && <FormMessage>{form.formState.errors.name.message}</FormMessage>}{' '}
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        <span className='text-white'>This subcategory will be shown during transaction input</span>
                      ) : (
                        <span className='text-black'>This subcategory will not be shown during transaction input</span>
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

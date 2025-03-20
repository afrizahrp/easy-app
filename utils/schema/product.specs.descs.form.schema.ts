import { z } from 'zod';
import { productFormSchema, ProductFormValues } from './product.form.schema';
import {
  productDescsFormSchema,
  ProductDescsFormValues,
} from './product.descs.form.schema';

export const productspecsdescsCombinedSchema = z.object({
  ...productFormSchema.shape,
  ...productDescsFormSchema.shape,
});

export type CombinedProductFormValues = ProductFormValues &
  ProductDescsFormValues;

export type SearchOptionItem = {
  value: string;
  label: string;
};

export type CategoryType = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  categoryType: string;
  slug: string | null;
  iStatus: string;
  imageURL: string;
  remarks?: string;
  iShowedStatus: string;
};

export type SalesInvoiceHd = {
  po_id?: string;
  poType?: string;
  invoiceType_id: string;
  invoiceType: string;
  poType_id: number;
  invoice_id: string;
  so_id?: string;
  invoiceDate: Date;
  ref_id?: string;
  tax_id?: string;
  taxRate?: number;
  debtor_id: string;
  debtorName?: string;
  customer_id: string;
  customerName: string;
  creditTerms?: number;
  dueDate?: Date;
  salesPerson_id?: string;
  salesPersonName: string;
  base_amount?: number;
  dp_amount?: number;
  discount_amount?: number;
  totalDiscount_amount?: number;
  tax_amount: number;
  totalDelivery_amount?: number;
  total_amount: number;
  grandTotal_amount?: number;
  paidStatus: string;
  monthYear: string;
  company_id: string;
};

export type SalesInvoiceDt = {
  invoice_id: string;
  line_no: number;
  acct_id: string;
  description?: string;
  product_id: string;
  productName: string;
  uom_id: string;
  unitPrice?: number;
  qty?: number;
  sellingPrice?: number;
  base_amount?: number;
  discount_amount?: number;
  tax_amount?: number;
  delivery_amount?: number;
  total_amount?: number;
};

export type SalesInvoiceDetailResponse = SalesInvoiceHd & {
  details: SalesInvoiceDt[];
};

export type Billboard = {
  id?: number;
  name: string;
  section?: number;
  contentURL: string;
  content_id: string;
  isImage: boolean;
  iStatus: string;
  iShowedStatus: string;
  remarks: string;
  company_id: string;
  branch_id: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy: string;
  updatedAt: string;
};

export interface Products {
  id: string;
  catalog_id?: string;
  catalog?: string | null;
  registered_id?: string;
  name?: string | null;
  category_id: string | null;
  category?: string | null;
  subCategory_id?: string;
  uom_id?: string;
  brand_id?: string;
  tkdn_pctg?: number;
  bmp_pctg?: number;
  ecatalog_URL?: string;
  iStatus?: boolean;
  remarks?: string | null;
  isMaterial?: boolean;
  iShowedStatus?: boolean;
  slug?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
  company?: string;
  branch?: string;
  images: ProductImages[];
}

export interface ProductImages {
  id: string;
  product_id: string;
  imageURL: string;
  isPrimary: boolean;
  createdBy?: string | null;
  createdAt?: Date | null;
  updatedBy?: string | null;
  updatedAt?: Date | null;
  company_id: string;
  branch_id: string;
}

export interface CategoryTypes {
  id?: string | null;
  name?: string | null;
}

export interface CategoryImages {
  id: string;
  category_id: string;
  imageURL: string;
  isPrimary: boolean;
}

export interface Materials {
  id: string;
  name: string;
  category_id: string;
  subCategory_id: string;
  uom_id: string;
  brand_id: string;
  iStatus: boolean;
  remarks: string;
  isMaterial: boolean;
}

export interface MaterialCategories {
  id: string;
  name: string;
}

export interface SubCategories {
  category_id: string;
  id: string;
  name: string;
}

export interface Brands {
  id: string;
  name: string;
}

export interface Uoms {
  id: string | '';
  name: string | '';
}

export interface Brands {
  id: string;
  name: string;
}

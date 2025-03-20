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

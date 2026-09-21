export type SupplierFormState = {
  status?: string;
  errors?: {
    _form?: string[];
    [key: string]: string[] | undefined;
  };
};
export type SupplierData = {
  id: string;
  name: string;
  supplier_pic: { name: string }[];
  address: string;
  credit_terms: number;
  notes: string;
  status: boolean;
};

export type BillOfMaterialsFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    code?: string[];
    type?: string[];
    description?: string[];
    status?: string[];
    product_units_id?: string[];
    products_id?: string[];
    _form?: string[];
  };
};

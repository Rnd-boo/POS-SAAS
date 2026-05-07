export type OpenManufacturingFormState = {
  status?: string;
  errors?: {
    id?: string[];
    open_manufacturing_date?: string[];
    branch_id?: string[];
    notes?: string[];
    origin_branch_location_id?: string[];
    destination_branch_location_id?: string[];
    product_units_id?: string[];
    bill_of_materials_id?: string[];
    product_name?: string[];
    type?: string[];
    qty?: string[];
    products_detail?: string[];
    _form?: string[];
  };
};

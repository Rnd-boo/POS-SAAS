export type ProductionOrderFormState = {
  status?: string;
  errors?: {
    production_order_date?: string[];
    notes?: string[];
    branch_id?: string[];
    bill_of_materials_id?: string[];
    qty?: string[];
    type?: string[];
    status?: string[];
    _form?: string[];
  };
};

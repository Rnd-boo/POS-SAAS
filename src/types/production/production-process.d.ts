export type ProductionProcessFormState = {
  status?: string;
  errors?: {
    production_process_date?: string[];
    production_orders_id?: string[];
    branch_id?: string[];
    branch_location_id?: string[];
    qty?: string[];
    notes?: string[];
    status?: string[];
    _form?: string[];
  };
};

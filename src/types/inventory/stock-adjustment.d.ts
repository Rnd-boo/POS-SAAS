export type StockAdjustmentFormState = {
  status?: string;
  errors?: {
    id?: string[];
    stock_adjustment_date?: string[];
    branch_id?: string[];
    notes?: string[];
    reason?: string[];
    branch_location_id?: string[];
    stock_adjustment_items?: string[];
    _form?: string[];
  };
};

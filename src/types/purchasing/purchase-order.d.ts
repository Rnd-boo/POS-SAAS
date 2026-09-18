export type PurchaseOrderFormState = {
  status?: string;
  errors?: {
    purchase_order_date?: string[];
    required_date?: string[];
    notes?: string[];
    branch_id?: string[];
    supplier_id?: string[];
    purchase_order_item?: string[];
    status?: string[];
    _form?: string[];
  };
};

export type PurchaseOrderData = {
  id: string;
  purchase_order_date: string;
  required_date: string;
  branch: { name: string };
  suppliers: { name: string };
  notes: string;
  status: string;
};

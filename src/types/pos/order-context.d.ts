export type OrderContextFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    tax_value?: string[];
    tax_name?: string[];
    other_tax_value?: string[];
    other_tax_name?: string[];
    brand_id?: string[];
    status?: string[];
    _form?: string[];
  };
};

export type OrderContextFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    brand_id?: string[];
    status?: string[];
    _form?: string[];
  };
};

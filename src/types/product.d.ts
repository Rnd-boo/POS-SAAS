export type ProductFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    categories_id?: string[];
    upc?: string[];
    description?: string[];
    status?: string[];
    _form?: string[];
  };
};

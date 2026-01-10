export type MenuFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    brand_id?: string[];
    menu_category_id?: string[];
    products_id?: string[];
    status?: string[];
    _form?: string[];
  };
};

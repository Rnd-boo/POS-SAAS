export type MenuFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    brand_id?: string[];
    menu_category_id?: string[];
    status?: string[];
    menu_branches?: string[];
    items_id?: string[];
    auto_decrement?: string[];
    _form?: string[];
  };
};

export type CategoryFormState = {
  status?: string;
  errors?: {
    id?: string[];
    created_by?: string[];
    name?: string[];
    description?: string[];
    is_active?: string[];
    _form?: string[];
  };
};

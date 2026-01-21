export type CategoryFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    status?: string[];
    _form?: string[];
  };
};

export type BrandFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    status?: string[];
    _form?: string[];
  };
};

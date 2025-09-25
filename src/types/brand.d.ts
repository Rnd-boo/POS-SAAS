export type BrandFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    status?: string[];
    _form?: string[];
  };
};

export type Brand = {
  id?: string;
  name?: string;
  status?: string;
};

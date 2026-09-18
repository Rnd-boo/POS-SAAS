export type SupplierFormState = {
  status?: string;
  errors?: {
    _form?: string[];
    [key: string]: string[] | undefined;
  };
};

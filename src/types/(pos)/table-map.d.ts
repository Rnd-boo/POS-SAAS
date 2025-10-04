export type TableMapFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    branch_id?: string[];
    status?: string[];
    _form?: string[];
  };
};

export type TableMap = {
  id?: string;
  name?: string;
  branch_id?: string;
  status?: string;
};

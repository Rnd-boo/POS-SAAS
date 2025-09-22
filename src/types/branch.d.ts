export type BranchFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    status?: string[];
    _form?: string[];
  };
};

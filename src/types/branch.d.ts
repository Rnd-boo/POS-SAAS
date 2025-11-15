export type BranchFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    branch_location?: string[];
    branch_order_context?: string[];
    status?: string[];
    _form?: string[];
  };
};

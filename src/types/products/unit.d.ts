export type UnitFormState = {
  status?: string;
  errors?: {
    id?: string[];
    created_by?: string[];
    name?: string[];
    notes?: string[];
    status?: string[];
    _form?: string[];
  };
};

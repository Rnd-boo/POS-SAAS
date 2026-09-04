export type UserRoleFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    user_permissions?: string[];
    status?: string[];
    _form?: string[];
  };
};

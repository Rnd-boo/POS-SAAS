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

export type UserRole = {
  id: number;
  name: string;
  role_permissions: {
    permission_id: string;
  }[];
};

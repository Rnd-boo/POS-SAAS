export type ClientProfilesFormState = {
  status?: string;
  errors?: {
    username?: string[];
    password?: string[];
    name?: string[];
    role?: string[];
    branch?: string[];
    _form?: string[];
  };
};

export type Profile = {
  id?: string;
  clients?: string;
  name?: string;
  role?: string;
  branch?: string;
  brand?: string;
  permissions?: {
    dashboard: boolean;
    inventory: boolean;
  };
};

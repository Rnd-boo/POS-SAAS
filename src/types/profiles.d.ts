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

import { Brand } from "./brand";

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

export type ProfileBranch = {
  client_profiles_id?: string;
  branch_id?: string;
};

export type Profile = {
  id?: string;
  clients?: string;
  name?: string;
  role?: string;
  branch?: ProfileBranch[];
  brand?: Brand[];
  permissions?: {
    dashboard: boolean;
    inventory: boolean;
  };
};

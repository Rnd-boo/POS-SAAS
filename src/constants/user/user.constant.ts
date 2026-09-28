export const INITIAL_USER = {
  name: "",
  username: "",
  password_hash: "",
  status: true,
  roles_id: "",
  brand_id: undefined,
  client_branches: [
    {
      user_id: "",
      branch_id: "",
    },
  ],
};

export const INITIAL_STATE_USER = {
  status: "idle",
  errors: {
    name: [],
    username: [],
    password_hash: [],
    status: [],
    roles_id: [],
    brand_id: [],
    client_branches: [],
    _form: [],
  },
};

export const INITIAL_ROLE = {
  name: "",
  status: true,
  role_permission: [
    {
      role_id: "",
      permission_id: "",
    },
  ],
};

export const INITIAL_STATE_ROLE = {
  status: "idle",
  errors: {
    name: [],
    status: [],
    role_permission: [],
    _form: [],
  },
};

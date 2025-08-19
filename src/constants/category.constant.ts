export const HEADER_TABLE_CATEGORY = [
  "NO",
  "Category",
  "Description",
  "Status",
  "Action",
];

export const INITIAL_CATEGORY = {
  name: "",
  description: "",
  is_active: "",
};

export const INITIAL_STATE_CATEGORY = {
  status: "idle",
  errors: {
    name: [],
    description: [],
    is_active: [],
    _form: [],
  },
};

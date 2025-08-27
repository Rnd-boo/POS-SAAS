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
  status: "",
};

export const INITIAL_STATE_CATEGORY = {
  status: "idle",
  errors: {
    name: [],
    description: [],
    status: [],
    _form: [],
  },
};

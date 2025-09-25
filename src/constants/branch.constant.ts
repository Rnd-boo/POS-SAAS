export const HEADER_TABLE_BRANCH = [
  "NO",
  "Branch Name",
  "Brand",
  "Status",
  "Action",
];

export const INITIAL_BRANCH = {
  name: "",
  status: "",
};

export const INITIAL_STATE_BRANCH = {
  status: "idle",
  errors: {
    name: [],
    status: [],
    _form: [],
  },
};

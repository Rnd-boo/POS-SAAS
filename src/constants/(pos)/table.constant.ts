export const HEADER_TABLE_TABLE_MAP = [
  "NO",
  "Table Map",
  "Branch",
  "Status",
  "Action",
];

export const INITIAL_TABLE_MAP = {
  name: "",
  branch_id: "",
  brand_id: "",
  status: "",
};

export const INITIAL_STATE_TABLE_MAP = {
  status: "idle",
  errors: {
    name: [],
    branch_id: [],
    brand_id: [],
    status: [],
    _form: [],
  },
};

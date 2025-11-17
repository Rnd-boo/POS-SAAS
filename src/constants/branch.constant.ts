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
  branch_location: [
    {
      name: "",
      type: "",
    },
  ],
  branch_order_context: [
    {
      branch_id: "",
      order_context: "",
    },
  ],
};

export const INITIAL_STATE_BRANCH = {
  status: "idle",
  errors: {
    name: [],
    status: [],
    branch_location: [],
    branch_order_context: [],
    _form: [],
  },
};

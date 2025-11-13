export const HEADER_TABLE_ORDER_CONTEXT = [
  "NO",
  "Order Context",
  "Status",
  "Action",
];

export const INITIAL_ORDER_CONTEXT = {
  name: "",
  status: "",
};

export const INITIAL_STATE_ORDER_CONTEXT = {
  status: "idle",
  errors: {
    name: [],
    status: [],
    _form: [],
  },
};

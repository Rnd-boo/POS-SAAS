export const HEADER_TABLE_ORDER_CONTEXT = [
  "NO",
  "Order Context",
  "Status",
  "Action",
];

export const INITIAL_ORDER_CONTEXT = {
  name: "",
  tax_value: "",
  tax_name: "",
  other_tax_value: "",
  other_tax_name: "",
  status: "",
};

export const INITIAL_STATE_ORDER_CONTEXT = {
  status: "idle",
  errors: {
    name: [],
    tax_value: [],
    tax_name: [],
    other_tax_value: [],
    other_tax_name: [],
    status: [],
    _form: [],
  },
};

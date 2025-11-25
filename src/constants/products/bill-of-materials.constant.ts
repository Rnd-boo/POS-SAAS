export const HEADER_TABLE_BOM = [
  "NO",
  "Bill Of Materials",
  "Code",
  "Type",
  "Product",
  "Unit",
  "Status",
  "Action",
];

export const INITIAL_BOM = {
  name: "",
  code: "",
  type: "",
  products_id: "",
  product_units_id: "",
  description: "",
  status: "",
};

export const INITIAL_STATE_BOM = {
  status: "idle",
  errors: {
    name: [],
    code: [],
    type: [],
    products_id: [],
    product_units_id: [],
    description: [],
    status: [],
    _form: [],
  },
};

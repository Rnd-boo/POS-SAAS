export const HEADER_TABLE_PRODUCT = [
  "NO",
  "Product",
  "Category",
  "Product Code",
  "Status",
  "Action",
];

export const INITIAL_PRODUCT = {
  name: "",
  categories_id: "",
  upc: "",
  description: "",
  status: "",
};

export const INITIAL_STATE_PRODUCT = {
  status: "idle",
  errors: {
    name: [],
    categories_id: [],
    upc: [],
    description: [],
    status: [],
    _form: [],
  },
};

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
  description: "",
  categories_id: "",
  status: "",
  upc: "",
  units: [{ units_id: "", conversion_factor: "", base_unit: "" }],
};

export const INITIAL_STATE_PRODUCT = {
  status: "idle",
  errors: {
    name: [],
    categories_id: [],
    upc: [],
    description: [],
    status: [],
    units: [],
    _form: [],
  },
};

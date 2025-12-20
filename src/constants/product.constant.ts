export const HEADER_TABLE_PRODUCT = [
  "NO",
  "Product",
  "Category",
  "Product Code",
  "Status",
  "Action",
];

export const FILTER_TABLE_PRODUCT = [
  { value: "Product Name", filter: "text" },
  { value: "Category", filter: "select" },
  { value: "Product Code", filter: "text" },
  { value: "Status", filter: "status" },
];

export const INITIAL_PRODUCT = {
  name: "",
  description: "",
  categories_id: "",
  status: "",
  upc: "",
  units: [
    {
      units_id: "",
      conversion_factor: "",
      base_unit: "",
      is_sales_unit: false,
    },
  ],
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

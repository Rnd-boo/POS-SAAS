export const HEADER_TABLE_BOM = [
  "NO",
  "Bill Of Material",
  "Code",
  "Product",
  "Unit",
  "Type",
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
  product_bom: [
    {
      products_id: "",
      product_units_id: "",
      qty: 0,
      wastePercentage: 0,
      waste: 0,
    },
  ],
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

import { FilterConfig } from "@/types/general";

export const FILTER_TABLE_PRODUCTION_ORDER: Omit<FilterConfig, "options">[] = [
  {
    key: "id",
    label: "Number",
    type: "text",
  },
  {
    key: "production_order_date",
    label: "Date",
    type: "text",
  },
  {
    key: "branch_id",
    label: "Branch",
    type: "combobox",
  },
  {
    key: "notes",
    label: "Notes",
    type: "text",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
  },
];

export const INITIAL_PRODUCTION_ORDER = {
  name: "",
  code: "",
  type: "",
  product_units_id: "",
  description: "",
  status: "",
  product_bom: [
    {
      products_id: "",
      product_units_id: "",
      qty: "",
      wastePercentage: 0,
      waste: 0,
    },
  ],
};

export const INITIAL_STATE_PRODUCTION_ORDER = {
  status: "idle",
  errors: {
    name: [],
    code: [],
    type: [],
    product_units_id: [],
    description: [],
    status: [],
    product_bom: [],
    _form: [],
  },
};

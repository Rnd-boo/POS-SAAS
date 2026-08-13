import { FilterConfig } from "@/types/general";

export const FILTER_TABLE_PRODUCT: Omit<FilterConfig, "options">[] = [
  {
    key: "name",
    label: "Product Name",
    type: "text",
  },
  {
    key: "categories_id",
    label: "Category",
    type: "combobox",
  },
  {
    key: "upc",
    label: "Product Code",
    type: "text",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
  },
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
      is_sales_unit: true,
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

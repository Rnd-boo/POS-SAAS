import { FilterConfig } from "@/types/general";

export type DisplayName = { productName?: string; unitName?: string };

export const FILTER_TABLE_BOM: Omit<FilterConfig, "options">[] = [
  {
    key: "name",
    label: "BOM Name",
    type: "text",
  },
  {
    key: "code",
    label: "BOM Code",
    type: "text",
  },
  {
    key: "product_units.products.id",
    label: "Product",
    type: "combobox",
  },
  {
    key: "product_units.units.id",
    label: "Product Unit",
    type: "combobox",
  },
  {
    key: "type",
    label: "Type",
    type: "select",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
  },
];

export const INITIAL_BOM = {
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
    product_units_id: [],
    description: [],
    status: [],
    product_bom: [],
    _form: [],
  },
};

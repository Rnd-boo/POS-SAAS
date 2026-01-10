import { FilterConfig } from "@/types/general";

export const MENU_TABLE_PRODUCT: Omit<FilterConfig, "options">[] = [
  {
    key: "name",
    label: "Menu Name",
    type: "text",
  },
  {
    key: "menu_category_id",
    label: "Menu Category",
    type: "combobox",
  },
   {
    key: "products_id",
    label: "Product",
    type: "combobox",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
  },
];

export const INITIAL_MENU = {
  name: "",
  status: "",
  menu_category_id: "",
  products_id: "",
  brand_id: "",
};

export const INITIAL_STATE_MENU = {
  status: "idle",
  errors: {
    name: [],
    status: [],
    menu_category_id: [],
    products_id: [],
    brand_id: [],
    _form: [],
  },
};
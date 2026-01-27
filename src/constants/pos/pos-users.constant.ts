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

export const INITIAL_POSUSERS = {
  name: "",
  status: "",
};

export const INITIAL_STATE_POSUSERS = {
  status: "idle",
  errors: {
    name: [],
    status: [],
    _form: [],
  },
};
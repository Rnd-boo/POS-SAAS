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
  menu_category_id: "",
  status: "",
  menu_branches: [],
  items_id: "",
  auto_decrement: true,
  brand_id: "",
};

export const INITIAL_STATE_MENU = {
  status: "idle",
  errors: {
    name: [],
    menu_category_id: [],
    status: [],
    menu_branches: [],
    items_id: [],
    auto_decrement: [],
    brand_id: [],
    _form: [],
  },
};

import { FilterConfig } from "@/types/general";

export const CATEGORY_TABLE_PRODUCT: Omit<FilterConfig, "options">[] = [
  {
    key: "name",
    label: "Category Name",
    type: "text",
  },
  {
    key: "description",
    label: "Description",
    type: "text",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
  },
];
export const INITIAL_CATEGORY = {
  name: "",
  description: "",
  status: "",
};

export const INITIAL_STATE_CATEGORY = {
  status: "idle",
  errors: {
    name: [],
    description: [],
    status: [],
    _form: [],
  },
};

import { formatDateLocal } from "@/lib/format-date";
import { FilterConfig } from "@/types/general";

export const FILTER_TABLE_STOCK_ADJUSTMENT: Omit<FilterConfig, "options">[] = [
  {
    key: "id",
    label: "Number",
    type: "text",
  },
  {
    key: "stock_adjustment_date",
    label: "Date",
    type: "date",
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
];

export const INITIAL_STOCK_ADJUSTMENT = {
  stock_adjustment_date: formatDateLocal(new Date()),
  branch_id: "",
  notes: "",
  branch_location_id: "",
  stock_adjustment_items: [
    {
      products_id: "",
      product_units_id: "",
      qty: "",
      on_hand: 0,
    },
  ],
};

export const INITIAL_STATE_STOCK_ADJUSTMENT = {
  status: "idle",
  errors: {
    stock_adjustment_date: [],
    branch_id: [],
    notes: [],
    branch_location_id: [],
    stock_adjustment_items: [],
    _form: [],
  },
};

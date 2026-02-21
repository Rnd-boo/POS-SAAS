import { formatDateLocal } from "@/lib/format-date";
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
  {
    key: "status",
    label: "Status",
    type: "select",
  },
];

export const INITIAL_PRODUCTION_ORDER = {
  production_order_date: formatDateLocal(new Date()),
  branch_id: "",
  notes: "",
  status: "",
  bill_of_materials_id: "",
  qty: "",
};

export const INITIAL_STATE_PRODUCTION_ORDER = {
  status: "idle",
  errors: {
    production_order_date: [],
    notes: [],
    branch_id: [],
    status: [],
    bill_of_materials_id: [],
    qty: [],
    _form: [],
  },
};

import { formatDateLocal } from "@/lib/format-date";
import { FilterConfig } from "@/types/general";

export const FILTER_TABLE_PRODUCTION_PROCESS: Omit<FilterConfig, "options">[] =
  [
    {
      key: "id",
      label: "Number",
      type: "text",
    },
    {
      key: "production_process_date",
      label: "Date",
      type: "date",
    },
    {
      key: "production_orders_id",
      label: "Production Order",
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

export const INITIAL_PRODUCTION_PROCESS = {
  production_process_date: formatDateLocal(new Date()),
  production_orders_id: "",
  branch_id: "",
  branch_location_id: "",
  qty: "",
  notes: "",
  status: "",
};

export const INITIAL_STATE_PRODUCTION_PROCESS = {
  status: "idle",
  errors: {
    production_order_date: [],
    production_orders_id: [],
    branch_id: [],
    branch_location_id: [],
    qty: [],
    notes: [],
    status: [],
    _form: [],
  },
};

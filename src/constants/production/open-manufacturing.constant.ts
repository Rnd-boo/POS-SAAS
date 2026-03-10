import { formatDateLocal } from "@/lib/format-date";
import { FilterConfig } from "@/types/general";

export const FILTER_TABLE_OPEN_MANUFACTURING: Omit<FilterConfig, "options">[] =
  [
    {
      key: "id",
      label: "Number",
      type: "text",
    },
    {
      key: "open_manufacturing_date",
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

export const INITIAL_OPEN_MANUFACTURING = {
  open_manufacturing_date: formatDateLocal(new Date()),
  branch_id: "",
  notes: "",
  qty: "",
  type: "",
};

export const INITIAL_STATE_OPEN_MANUFACTURING = {
  status: "idle",
  errors: {
    open_manufacturing_date: [],
    notes: [],
    branch_id: [],
    qty: [],
    type: [],
    _form: [],
  },
};

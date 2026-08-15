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
  origin_branch_location_id: "",
  destination_branch_location_id: "",
  product_units_id: "",
  bill_of_materials_id: "",
  type: "",
  product_name: "",
  qty: "",
  products_detail: [
    {
      products_id: "",
      product_units_id: "",
      qty: "",
      on_hand: 0,
    },
  ],
};

export const INITIAL_STATE_OPEN_MANUFACTURING = {
  status: "idle",
  errors: {
    open_manufacturing_date: [],
    branch_id: [],
    notes: [],
    origin_branch_location_id: [],
    destination_branch_location_id: [],
    product_units_id: [],
    bill_of_materials_id: [],
    product_name: [],
    type: [],
    qty: [],
    products_detail: [],
    _form: [],
  },
};

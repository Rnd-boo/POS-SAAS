import { formatDateLocal } from "@/lib/format-date";

export const INITIAL_PURCHASE_ORDER = {
  purchase_order_date: formatDateLocal(new Date()),
  required_date: formatDateLocal(new Date()),
  branch_id: "",
  supplier_id: "",
  due_days: "",
  notes: "",
  purchase_order_item: [
    {
      products_id: "",
      product_units_id: "",
      qty: 0,
      discount: 0,
      old_price: 0,
      new_price: 0,
    },
  ],
};

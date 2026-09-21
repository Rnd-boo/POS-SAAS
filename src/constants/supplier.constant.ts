import { FilterConfig } from "@/types/general";
import { SupplierForm } from "@/validations/supplier-validation";

export const INITIAL_SUPPLIER: SupplierForm = {
  brand_id: "",
  name: "",
  address: "",
  city: "",
  state: "",
  country: "",
  phone: "",
  status: "",
  payment_method: "",
  credit_terms: "",
  bank_name: "",
  bank_account_number: "",
  bank_account_name: "",
  supplier_PIC: [{ name: "", email: "", phone: "", is_default: true }],
};

export const INITIAL_STATE_SUPPLIER = {
  status: "idle",
  errors: { _form: [] },
};

export const FILTER_TABLE_SUPPLIER: Omit<FilterConfig, "options">[] = [
  {
    key: "name",
    label: "Supplier name",
    type: "text",
  },
  {
    key: "supplier_pic.name",
    label: "Contact name",
    type: "text",
  },
  {
    key: "address",
    label: "Address",
    type: "text",
  },
  {
    key: "credit_terms",
    label: "Credit Terms",
    type: "text",
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

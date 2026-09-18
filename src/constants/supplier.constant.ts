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

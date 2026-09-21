import z from "zod";

export const supplierSchema = z.object({
  name: z.string(),
  brand_id: z.number(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  phone: z.string(),
  status: z.boolean(),
  payment_method: z.enum(["cash", "credit"]),
  credit_terms: z.number(),
  bank_name: z.string(),
  bank_account_number: z.string(),
  bank_account_name: z.string(),
});

export const supplierPIC = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  is_default: z.boolean(),
});

export const supplierFormSchema = z.object({
  brand_id: z.string().min(1, "Brand is required"),
  name: z.string().min(1, "Supplier Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone is required"),
  status: z.string().min(1, "Status is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  credit_terms: z.string().min(1, "Credit terms is required"),
  bank_name: z.string(),
  bank_account_number: z.string(),
  bank_account_name: z.string(),
  supplier_PIC: z.array(supplierPIC).min(1, "At least one PIC is required"),
});

export type SupplierForm = z.infer<typeof supplierFormSchema>;
export type Supplier = z.infer<typeof supplierSchema> & {
  id: string;
  created_at?: string;
  updated_at?: string;
  brand?: { name: string } | null;
  supplier_PIC?: SupplierPIC[];
};

export type SupplierPIC = z.infer<typeof supplierPIC> & {
  id: string;
};

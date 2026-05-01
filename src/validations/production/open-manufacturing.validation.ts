import z from "zod";

export const openManufacturingSchema = z.object({
  open_manufacturing_date: z.string(),
  branch_id: z.number(),
  brand_id: z.number().optional(),
  notes: z.string(),
  origin_branch_location_id: z.string().optional(),
  destination_branch_location_id: z.string().optional(),
  type: z.string(),
  qty: z.string().optional(),
});
export const productDetailSchema = z.object({
  product_units_id: z.string(),
  qty: z.string(),
  stock: z.string().optional(),
  product_name: z.string().optional(),
  product_upc: z.string().optional(),
  unit_name: z.string().optional(),
  bill_of_material_qty: z.string().optional(),
});

export const openManufacturingFormSchema = z.object({
  open_manufacturing_date: z.string().min(1, "Date is required"),
  branch_id: z.string().min(1, "Branch is required"),
  notes: z.string().optional(),
  origin_branch_location_id: z.string().min(1, "Origin branch is required"),
  destination_branch_location_id: z
    .string()
    .min(1, "Destination branch is required"),
  product_units_id: z.string().min(1, "Product is required"),
  bill_of_materials_id: z.string().optional(),
  product_name: z.string().optional(),
  type: z.string(),
  qty: z.string().min(1, "QTY is required"),
  products_detail: z.array(productDetailSchema),
});

export type OpenManufacturing = z.infer<typeof openManufacturingSchema> & {
  id: string;
};
export type OpenManufacturingForm = z.infer<typeof openManufacturingFormSchema>;

import z from "zod";

export const billOfMaterialsSchema = z.object({
  name: z.string(),
  code: z.string(),
  type: z.string(),
  product_units_id: z.number(),
  status: z.boolean(),
  description: z.string(),
});

export const productBOMSchema = z.object({
  bill_of_materials_id: z.string().optional(),
  product_units_id: z.string().min(1, "Product is required"),
  qty: z.string().min(1, "Qty is required"),
  wastePercentage: z.coerce.number().optional(),
  waste: z.coerce.number().optional(),
});

export const billOfMaterialsFormSchema = z.object({
  name: z.string().min(1, "BOM Name is required"),
  code: z.string().min(1, "BOM Code is required"),
  type: z.string().min(1, "BOM Type is required"),
  product_units_id: z.string().min(1, "Product is required"),
  status: z.string().min(1, "Status is required"),
  description: z.string().optional(),
  brand_id: z.string().optional(),
  product_bom: z.array(productBOMSchema),
});

export type BillOfMaterials = z.infer<typeof billOfMaterialsSchema> & {
  id: string;
};
export type BillOfMaterialsForm = z.infer<typeof billOfMaterialsFormSchema>;

export type ProductBOMForm = z.infer<typeof productBOMSchema>;

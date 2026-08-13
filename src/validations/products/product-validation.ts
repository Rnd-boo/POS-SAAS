import z from "zod";

export const productUnitSchema = z.object({
  units_id: z.string().min(1, "Unit is required"),
  conversion_factor: z.string().min(1, "Conversion Factor is required"),
  base_unit: z.string(),
  is_sales_unit: z.boolean(),
  brand_id: z.number().optional(),
});

export const productSchema = z.object({
  name: z.string(),
  categories_id: z.string(),
  description: z.string(),
  upc: z.string(),
  status: z.boolean(),
  brand_id: z.number(),
  units: z.array(productUnitSchema).optional(),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Product Name is required"),
  categories_id: z.string().min(1, "Category is required"),
  description: z.string(),
  upc: z.string().min(1, "Product Code is required"),
  status: z.string().min(1, "Status is required"),
  brand_id: z.string().optional(),
  // Product Unit Fields
  units: z.array(productUnitSchema).min(1, "At least one unit is required"),
});

export type Product = z.infer<typeof productSchema> & { id: string };
export type ProductUnit = z.infer<typeof productUnitSchema> & { id: string };
export type ProductForm = z.infer<typeof productFormSchema>;

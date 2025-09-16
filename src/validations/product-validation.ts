import z from "zod";

export const productUnitSchema = z.object({
  units_id: z.string().min(1, "Unit is required"),
  conversion_factor: z.string(),
});

export const productSchema = z.object({
  name: z.string(),
  categories_id: z.string(),
  description: z.string(),
  upc: z.string(),
  // base_price: z.number(),
  status: z.boolean(),
  units: z.array(productUnitSchema).optional(),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Product Name is required"),
  categories_id: z.string().min(1, "Category is required"),
  description: z.string(),
  upc: z.string().min(1, "Product Code is required"),
  // base_price: z.string().min(1, "Base Price is required"),
  status: z.string().min(1, "Status is required"),
  // Product Unit Fields
  units: z.array(productUnitSchema),
});

export type Product = z.infer<typeof productSchema> & { id: string };
export type ProductUnit = z.infer<typeof productUnitSchema> & { id: number };
export type ProductForm = z.infer<typeof productFormSchema>;

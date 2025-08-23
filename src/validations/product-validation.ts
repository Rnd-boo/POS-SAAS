import z from "zod";

export const productSchema = z.object({
  name: z.string(),
  category_id: z.string(),
  description: z.string(),
  upc: z.string(),
  base_price: z.number(),
  is_active: z.string(),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Product Name is required"),
  category_id: z.string().min(1, "Category is required"),
  description: z.string(),
  upc: z.string().min(1, "Product Code is required"),
  base_price: z.string().min(1, "Base Price is required"),
  is_active: z.string().min(1, "Status is required"),
});

export type Product = z.infer<typeof productSchema> & { id: string };
export type ProductForm = z.infer<typeof productFormSchema>;

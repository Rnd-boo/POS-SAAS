import z from "zod";

export const menuSchema = z.object({
  name: z.string(),
  status: z.boolean(),
  menu_category_id: z.number(),
  products_id: z.number(),
  brand_id: z.number(),
});

export const menuFormSchema = z.object({
  name: z.string().min(1, "Order Context Name is required"),
  status: z.string().min(1, "Status is required"),
  products_id: z.string(),
  menu_category_id: z.string(),
  brand_id: z.string(),
});

export type MenuForm = z.infer<typeof menuFormSchema>;
export type Menu = z.infer<typeof menuSchema> & {
  id: string;
};

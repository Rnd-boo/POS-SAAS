import z from "zod";

export const menuSchema = z.object({
  name: z.string(),
  menu_category_id: z.number(),
  status: z.boolean(),
  items_id: z.number(),
  brand_id: z.number(),
  auto_decrement: z.boolean(),
});

export const menuBranchesSchema = z.object({
  menu_id: z.string(),
  branch_id: z.string().min(1, "Order Context is required"),
});

export const menuFormSchema = z.object({
  name: z.string().min(1, "Order Context Name is required"),
  menu_category_id: z.string(),
  status: z.string().min(1, "Status is required"),
  type_stock: z.string(),
  items_id: z.string().optional(),
  auto_decrement: z.boolean(),
  brand_id: z.string(),
  menu_branches: z.array(menuBranchesSchema),
});

export type MenuForm = z.infer<typeof menuFormSchema>;
export type Menu = z.infer<typeof menuSchema> & {
  id: string;
};

export type MenuBranches = z.infer<typeof menuBranchesSchema>;

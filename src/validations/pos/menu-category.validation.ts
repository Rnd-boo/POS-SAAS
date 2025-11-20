import z from "zod";

export const menuCategorySchema = z.object({
  name: z.string(),
  status: z.boolean(),
});

export const menuCategoryFormSchema = z.object({
  name: z.string().min(1, "Order Context Name is required"),
  status: z.string().min(1, "Status is required"),
});

export type MenuCategoryForm = z.infer<typeof menuCategoryFormSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema> & {
  id: string;
};

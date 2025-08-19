import z from "zod";

export const categorySchema = z.object({
  name: z.string(),
  description: z.string(),
  is_active: z.boolean(),
});

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Category Name is required"),
  description: z.string(),
  is_active: z.string().min(1, "Status is required"),
});

export type CategoryForm = z.infer<typeof categoryFormSchema>;
export type Category = z.infer<typeof categorySchema> & { id: string };

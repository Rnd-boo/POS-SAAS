import z from "zod";

export const unitSchema = z.object({
  name: z.string(),
  notes: z.string(),
  status: z.boolean(),
  brand_id: z.number().optional(),
});

export const unitFormSchema = z.object({
  name: z.string().min(1, "Unit Name is required"),
  notes: z.string(),
  status: z.string().min(1, "Status is required"),
  brand_id: z.string().optional(),
});

export type UnitForm = z.infer<typeof unitFormSchema>;
export type Unit = z.infer<typeof unitSchema> & { id: string };

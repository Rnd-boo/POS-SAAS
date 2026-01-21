import z from "zod";

export const unitSchema = z.object({
  name: z.string(),
  notes: z.string(),
  status: z.boolean(),
});

export const unitFormSchema = z.object({
  name: z.string().min(1, "Unit Name is required"),
  notes: z.string(),
  status: z.string().min(1, "Status is required"),
});

export type UnitForm = z.infer<typeof unitFormSchema>;
export type Unit = z.infer<typeof unitSchema> & { id: string };

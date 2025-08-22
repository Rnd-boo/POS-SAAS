import z from "zod";

export const unitSchema = z.object({
  name: z.string(),
  notes: z.string(),
});

export const unitFormSchema = z.object({
  name: z.string().min(1, "Unit Name is required"),
  notes: z.string(),
});

export type UnitForm = z.infer<typeof unitFormSchema>;
export type Unit = z.infer<typeof unitSchema> & { id: string };

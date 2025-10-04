import z from "zod";

export const tableMapSchema = z.object({
  name: z.string(),
  branch_id: z.string(),
  brand_id: z.number(),
  status: z.boolean(),
});

export const tableMapFormSchema = z.object({
  name: z.string().min(1, "Table Map Name is required"),
  branch_id: z.string().min(1, "Branch is required"),
  brand_id: z.string(),
  status: z.string().min(1, "Status is required"),
});

export type TableForm = z.infer<typeof tableMapFormSchema>;
export type Table = z.infer<typeof tableMapSchema> & {
  id: string;
  created_at: string;
  updated_at: string;
  client_profiles: { name: string }[];
};

import z from "zod";

export const branchSchema = z.object({
  name: z.string(),
  brand_id: z.number(),
  status: z.boolean(),
});

export const branchFormSchema = z.object({
  name: z.string().min(1, "Branch Name is required"),
  brand_id: z.string().min(1, "Brand is required"),
  status: z.string().min(1, "Status is required"),
});

export type BranchForm = z.infer<typeof branchFormSchema>;
export type Branch = z.infer<typeof branchSchema> & {
  id: string;
  created_at: string;
  updated_at: string;
  client_profiles: string;
};

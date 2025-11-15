import z from "zod";

export const branchSchema = z.object({
  name: z.string(),
  brand_id: z.number(),
  status: z.boolean(),
});

export const branchLocationSchema = z.object({
  name: z.string(),
  type: z.string(),
  branch_id: z.number().optional(),
});

export const branchOrderContext = z.object({
  branch_id: z.string(),
  order_context: z.string(),
});

export const branchFormSchema = z.object({
  name: z
    .string()
    .min(1, "Branch Name is required")
    .max(48, "Branch Name is too long"),
  status: z.string().min(1, "Status is required"),
  branch_location: z.array(branchLocationSchema),
  branch_order_context: z.array(branchOrderContext),
});

export type BranchForm = z.infer<typeof branchFormSchema>;
export type Branch = z.infer<typeof branchSchema> & {
  id: string;
  created_at: string;
  updated_at: string;
  client_profiles: string;
};

export type BranchOrderContext = z.infer<typeof branchOrderContext> & {
  id: string;
};

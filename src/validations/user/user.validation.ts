import z from "zod";

export const userSchema = z.object({
  name: z.string(),
  username: z.string(),
  password_hash: z.string(),
  status: z.boolean(),
  roles_id: z.string(),
  brand_id: z.string().optional(),
});

export const userBranchSchema = z.object({
  user_id: z.string().optional(),
  branch_id: z.string(),
});

export const userFormSchema = z.object({
  name: z.string().min(1, "Branch Name is required"),
  status: z.string().optional(),
  brand_id: z.number().optional(),
  user_branches: z.array(userBranchSchema),
});

export type UserForm = z.infer<typeof userFormSchema>;
export type User = z.infer<typeof userSchema> & {
  id: string;
};

export type UserBranch = z.infer<typeof userBranchSchema>;

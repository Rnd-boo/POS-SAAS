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
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, _ and -",
    ),
  password_hash: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^[^ ]+$/, "Password cannot contain spaces"),
  roles_id: z.string().min(1, "Roles is required"),
  status: z.boolean(),
  brand_id: z.string().optional(),
  client_branches: z.array(userBranchSchema),
});

export type UserForm = z.infer<typeof userFormSchema>;
export type User = z.infer<typeof userSchema> & {
  id: string;
};

export type UserBranch = z.infer<typeof userBranchSchema>;

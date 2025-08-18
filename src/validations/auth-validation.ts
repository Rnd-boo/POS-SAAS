import z from "zod";

export const loginSchemaForm = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  branch: z.string().min(1, "Branch is required"),
  brand: z.string().min(1, "Brand is required"),
});

export type LoginForm = z.infer<typeof loginSchemaForm>;

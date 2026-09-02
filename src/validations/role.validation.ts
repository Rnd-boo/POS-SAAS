import z from "zod";

export const roleSchema = z.object({
  name: z.string(),
  brand_id: z.number().optional(),
  status: z.boolean(),
});

export const rolePermissionSchema = z.object({
  role_id: z.number(),
  permission_id: z.number(),
});

export const roleFormSchema = z.object({
  name: z.string().min(1, "Branch Name is required"),
  status: z.string().min(1, "Status is required"),
  brand_id: z.number().optional(),
  role_permissions: z.array(rolePermissionSchema),
});

export type RolesForm = z.infer<typeof rolePermissionSchema>;
export type Roles = z.infer<typeof roleSchema> & {
  id: string;
};

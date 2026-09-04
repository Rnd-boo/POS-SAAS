import z from "zod";

export const roleSchema = z.object({
  name: z.string(),
  brand_id: z.number().optional(),
  status: z.boolean(),
});

export const rolePermissionSchema = z.object({
  role_id: z.string().optional(),
  permission_id: z.string(),
});

export const roleFormSchema = z.object({
  name: z.string().min(1, "Branch Name is required"),
  status: z.boolean().optional(),
  brand_id: z.number().optional(),
  role_permissions: z.array(rolePermissionSchema),
});

export type RolesForm = z.infer<typeof roleFormSchema>;
export type Roles = z.infer<typeof roleSchema> & {
  id: string;
};

export type RolePermission = z.infer<typeof rolePermissionSchema> & {
  id: string;
};

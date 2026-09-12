"use client";

import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import CardFormUserRole from "../../_components/role/card-form-user-role";
import { roleFormSchema, RolesForm } from "@/validations/user/role.validation";
import { INITIAL_ROLE } from "@/constants/user/user-role.constant";
import { UserRole } from "@/types/user-role";

export default function DetailUserRole() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const params = useParams();
  const userRoleId = params?.id as string;
  const form = useForm<RolesForm>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: INITIAL_ROLE,
  });
  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles", userRoleId],

    queryFn: async () => {
      const query = supabase
        .from("roles")
        .select(
          `
            id,
            name,
            status,
            role_permissions (
                permission_id
            )
          `,
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .eq("id", userRoleId)
        .single();
      const result = await query.overrideTypes<UserRole>();

      if (result.error)
        toast.error("Get User Role Data Failed", {
          description: result.error.message,
        });
      return result.data;
    },
    enabled: !!currentId && !!userRoleId,
  });

  useEffect(() => {
    form.setValue("name", String(roles?.name));
    form.setValue("status", String(roles?.status));

    const rolePermissions = roles?.role_permissions.map((rolePermission) => ({
      permission_id: rolePermission.permission_id,
    }));
    form.setValue("role_permissions", rolePermissions ?? []);
  }, [roles, form]);

  return (
    <CardFormUserRole type="Detail" form={form} isLoading={isLoadingRoles} />
  );
}

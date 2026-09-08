"use client";

import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { roleFormSchema, RolesForm } from "@/validations/role.validation";
import {
  INITIAL_ROLE,
  INITIAL_STATE_ROLE,
} from "@/constants/user/user-role.constant";
import { UserRole } from "@/types/user-role";
import CardFormUserRole from "../../_components/card-form-user-role";
import { updateUserRole } from "../../action";

export default function EditUserRole() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const RoleId = params?.id as string;
  const form = useForm<RolesForm>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: INITIAL_ROLE,
  });
  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles", RoleId],

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
        .eq("id", RoleId)
        .single();
      const result = await query.overrideTypes<UserRole>();

      if (result.error)
        toast.error("Get User Role Data Failed", {
          description: result.error.message,
        });
      return result.data;
    },
    enabled: !!currentId && !!RoleId,
  });

  useEffect(() => {
    form.setValue("name", String(roles?.name));
    form.setValue("status", String(roles?.status));

    const rolePermissions = roles?.role_permissions.map((rolePermission) => ({
      permission_id: rolePermission.permission_id,
    }));
    form.setValue("role_permissions", rolePermissions ?? []);
  }, [roles, form]);

  const [updateUserRoleState, updateUserRoleAction, isPendingUpdateUserRole] =
    useActionState(updateUserRole, INITIAL_STATE_ROLE);
  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "role_permissions") {
        formData.append("role_permissions", JSON.stringify(value));
      } else {
        formData.append(key, String(value ?? ""));
      }
    });
    formData.append("id", String(RoleId));

    startTransition(() => {
      updateUserRoleAction(formData);
    });
  });

  useEffect(() => {
    if (updateUserRoleState?.status === "error") {
      toast.error("Update Role Failed", {
        description: updateUserRoleState.errors?._form?.[0],
      });
    }
    if (updateUserRoleState?.status === "success") {
      toast.success("Update Role Success");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["roles"] });
      router.push("/master-data/user-role");
    }
  }, [updateUserRoleState]);

  return (
    <CardFormUserRole
      type="Update"
      form={form}
      isLoading={isLoadingRoles}
      isPending={isPendingUpdateUserRole}
      onSubmit={onSubmit}
    />
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useBrandStore } from "@/stores/brand-store";
import { roleFormSchema, RolesForm } from "@/validations/role.validation";
import {
  INITIAL_ROLE,
  INITIAL_STATE_ROLE,
} from "@/constants/user/user-role.constant";
import CardFormUserRole from "../_components/card-form-user-role";
import { createUserRole } from "../action";

export default function CreateUserRole() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);

  const form = useForm<RolesForm>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: INITIAL_ROLE,
  });
  const [createRoleState, createRoleAction, isPendingCreateRole] =
    useActionState(createUserRole, INITIAL_STATE_ROLE);

  const onSubmit = form.handleSubmit(async (data) => {
    // Debug: Log the form data
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "role_permissions") {
        formData.append("role_permissions", JSON.stringify(value));
      } else {
        formData.append(key, String(value ?? ""));
      }
    });
    formData.append("brand_id", String(currentBrandId));

    startTransition(() => {
      createRoleAction(formData);
    });
  });
  useEffect(() => {
    if (createRoleState?.status === "error") {
      toast.error("Create Role Failed", {
        description: createRoleState.errors?._form?.[0],
      });
    }
    if (createRoleState?.status === "success") {
      toast.success("Create Role Success");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["roles"] });
      router.push("/master-data/user-role");
    }
  }, [createRoleState]);

  return (
    <CardFormUserRole
      type="Create"
      form={form}
      isPending={isPendingCreateRole}
      onSubmit={onSubmit}
    />
  );
}

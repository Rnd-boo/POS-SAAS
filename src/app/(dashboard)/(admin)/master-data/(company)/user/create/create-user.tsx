"use client";

import {
  INITIAL_STATE_USER,
  INITIAL_USER,
} from "@/constants/user/user.constant";
import { UserForm, userFormSchema } from "@/validations/user/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CardFormUser from "../_components/user/card-form-user";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createUser } from "../action";

export default function CreateUser() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: INITIAL_USER,
  });

  const [createUserState, createUserAction, isPendingCreateUser] =
    useActionState(createUser, INITIAL_STATE_USER);

  const onSubmit = form.handleSubmit(async (data) => {
    // Debug: Log the form data
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "client_branches") {
        formData.append("client_branches", JSON.stringify(value));
      } else {
        formData.append(key, String(value ?? ""));
      }
    });
    formData.set("brand_id", String(currentBrandId));
    startTransition(() => {
      createUserAction(formData);
    });
  });
  useEffect(() => {
    if (createUserState?.status === "error") {
      toast.error("Create User Failed", {
        description: createUserState.errors?._form?.[0],
      });
    }
    if (createUserState?.status === "success") {
      toast.success("Create User Success");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["client_profiles"] });
      router.push("/master-data/user");
    }
  }, [createUserState]);

  return (
    <CardFormUser
      type="Create"
      form={form}
      isPending={isPendingCreateUser}
      onSubmit={onSubmit}
    />
  );
}

"use client";

import { INITIAL_USER } from "@/constants/user/user.constant";
import { UserForm, userFormSchema } from "@/validations/user/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CardFormUser from "../_components/user/card-form-user";

export default function CreateUser() {
  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: INITIAL_USER,
  });

  return (
    <CardFormUser
      type="Create"
      form={form}
      //  isPending={isPendingCreateRole}
      //  onSubmit={onSubmit}
    />
  );
}

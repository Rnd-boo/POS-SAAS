"use client";

import { useForm } from "react-hook-form";
import CardFormMenu from "../_components/card-form-menu";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  INITIAL_MENU,
  INITIAL_STATE_MENU,
} from "@/constants/pos/menu.constant";
import { MenuForm, menuFormSchema } from "@/validations/pos/menu.validation";
import { startTransition, useActionState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createMenu } from "../action";

export default function CreateMenu() {
  const queryClient = useQueryClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const router = useRouter();

  const form = useForm<MenuForm>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: INITIAL_MENU,
  });
  const [createMenuState, createMenuAction, isPendingcreateMenu] =
    useActionState(createMenu, INITIAL_STATE_MENU);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append("brand_id", String(currentBrandId));
      formData.append(key, value);
    });
    startTransition(() => {
      createMenuAction(formData);
    });
  });
  useEffect(() => {
    if (createMenuState?.status === "error") {
      toast.error("Create Menu Failed", {
        description: createMenuState.errors?._form?.[0],
      });
    }
    if (createMenuState?.status === "success") {
      toast.success("Create Menu Success");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["menu"] });
      router.push("/master-data/menu");
    }
  }, [createMenuState]);
  return (
    <CardFormMenu
      type="Create"
      form={form}
      isPending={isPendingcreateMenu}
      onSubmit={onSubmit}
    />
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import {
  OpenManufacturingForm,
  openManufacturingFormSchema,
} from "@/validations/production/open-manufacturing.validation";
import {
  INITIAL_OPEN_MANUFACTURING,
  INITIAL_STATE_OPEN_MANUFACTURING,
} from "@/constants/production/open-manufacturing.constant";
import CardOpenManufacturing from "../_components/card-open-manufacturing";
import { createOpenManufacturing } from "../action";

export default function CreateOpenManufacturing() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const form = useForm<OpenManufacturingForm>({
    resolver: zodResolver(openManufacturingFormSchema),
    defaultValues: INITIAL_OPEN_MANUFACTURING,
  });

  const [
    createOpenManufacturingState,
    createOpenManufacturingAction,
    isPendingcreateOpenManufacturing,
  ] = useActionState(createOpenManufacturing, INITIAL_STATE_OPEN_MANUFACTURING);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "products_detail") {
        formData.append("products_detail", JSON.stringify(value));
      } else {
        formData.append(key, String(value ?? ""));
      }
      formData.append("brand_id", String(currentBrandId));
    });
    startTransition(() => {
      createOpenManufacturingAction(formData);
    });
    console.log(data);
  });

  useEffect(() => {
    if (createOpenManufacturingState?.status === "error") {
      toast.error("Create Open Manufacturing Failed", {
        description: createOpenManufacturingState.errors?._form?.[0],
      });
    }
    if (createOpenManufacturingState?.status === "success") {
      toast.success("Create Open Manufacturing Success");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["open_manufacturing"] });
      router.push("/production/open-manufacturing");
    }
  }, [createOpenManufacturingState]);

  useEffect(() => {
    form.setValue("type", type ?? "");
  }, [type]);

  const allowedTypes = ["assembly", "disassembly"];
  if (!type || !allowedTypes.includes(type)) {
    notFound();
  }

  return (
    <CardOpenManufacturing form={form} type="Create" onSubmit={onSubmit} />
  );
}

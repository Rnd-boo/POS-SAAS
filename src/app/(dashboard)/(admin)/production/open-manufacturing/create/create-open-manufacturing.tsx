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
import { INITIAL_OPEN_MANUFACTURING } from "@/constants/production/open-manufacturing.constant";
import CardOpenManufacturing from "../_components/card-open-manufacturing";
import { NextResponse } from "next/server";

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

  // const [createProductState, createProductAction, isPendingcreateProduct] =
  //   useActionState(createProduct, INITIAL_STATE_PRODUCT);

  const onSubmit = form.handleSubmit(async (data) => {
    // const formData = new FormData();
    // Object.entries(data).forEach(([key, value]) => {
    //   if (key === "units") {
    //     formData.append("units", JSON.stringify(value));
    //   } else {
    //     formData.append(key, String(value ?? ""));
    //   }
    //   formData.append("brand_id", String(currentBrandId));
    // });
    // startTransition(() => {
    //   createProductAction(formData);
    // });
  });

  //   useEffect(() => {
  //     if (createProductState?.status === "error") {
  //       toast.error("Create Product Failed", {
  //         description: createProductState.errors?._form?.[0],
  //       });
  //     }
  //     if (createProductState?.status === "success") {
  //       toast.success("Create Product Success");
  //       form.reset();
  //       queryClient.refetchQueries({ queryKey: ["products"] });
  //       router.push("/master-data/product");
  //     }
  //   }, [createProductState]);

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

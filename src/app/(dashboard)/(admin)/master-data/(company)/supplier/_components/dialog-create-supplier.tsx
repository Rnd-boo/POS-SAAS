"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { INITIAL_STATE_SUPPLIER, INITIAL_SUPPLIER } from "@/constants/supplier.constant";
import { SupplierForm, supplierFormSchema } from "@/validations/supplier-validation";
import { createSupplier } from "../action";
import FormSupplier from "./form-supplier";

export default function DialogCreateSupplier({ refetch, brands }: { refetch: () => void; brands: { value: string; label: string }[] }) {
  const form = useForm<SupplierForm>({ resolver: zodResolver(supplierFormSchema), defaultValues: INITIAL_SUPPLIER });
  const [state, action, pending] = useActionState(createSupplier, INITIAL_STATE_SUPPLIER);
  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, typeof value === "string" ? value : JSON.stringify(value)));
    formData.append("brand_id", data.brand_id);
    startTransition(() => action(formData));
  });
  useEffect(() => {
    if (state.status === "error") toast.error("Create Supplier Failed", { description: state.errors?._form?.[0] });
    if (state.status === "success") { toast.success("Create Supplier Success"); form.reset(); document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click(); refetch(); }
  }, [state, form, refetch]);
  return <FormSupplier form={form} onSubmit={onSubmit} isLoading={pending} type="Create" brands={brands} />;
}

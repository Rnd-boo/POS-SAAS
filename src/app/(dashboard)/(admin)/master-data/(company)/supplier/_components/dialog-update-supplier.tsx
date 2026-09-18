"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { INITIAL_STATE_SUPPLIER } from "@/constants/supplier.constant";
import { Supplier, SupplierForm, supplierFormSchema } from "@/validations/supplier-validation";
import { updateSupplier } from "../action";
import FormSupplier from "./form-supplier";

export default function DialogUpdateSupplier({ refetch, currentData, open, handleChangeAction, brands }: { refetch: () => void; currentData?: Supplier; open?: boolean; handleChangeAction?: (open: boolean) => void; brands: { value: string; label: string }[] }) {
  const form = useForm<SupplierForm>({ resolver: zodResolver(supplierFormSchema) });
  const [state, action, pending] = useActionState(updateSupplier, INITIAL_STATE_SUPPLIER);
  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, typeof value === "string" ? value : JSON.stringify(value)));
    formData.append("id", currentData?.id ?? "");
    formData.append("brand_id", data.brand_id);
    startTransition(() => action(formData));
  });
  useEffect(() => {
    if (!currentData) return;
    form.reset({ ...currentData, brand_id: String(currentData.brand_id), status: String(currentData.status), payment_method: currentData.payment_method, credit_terms: String(currentData.credit_terms), supplier_PIC: currentData.supplier_PIC ?? [{ name: "", email: "", phone: "", is_default: true }] } as SupplierForm);
  }, [currentData, form]);
  useEffect(() => {
    if (state.status === "error") toast.error("Update Supplier Failed", { description: state.errors?._form?.[0] });
    if (state.status === "success") { toast.success("Update Supplier Success"); handleChangeAction?.(false); refetch(); }
  }, [state, refetch, handleChangeAction]);
  return <Dialog open={open} onOpenChange={handleChangeAction}><FormSupplier form={form} onSubmit={onSubmit} isLoading={pending} type="Update" brands={brands} /></Dialog>;
}

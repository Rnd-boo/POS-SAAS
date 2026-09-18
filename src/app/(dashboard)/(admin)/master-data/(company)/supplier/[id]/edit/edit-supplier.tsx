"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CardFormSupplier from "../../_components/card-form-supplier";
import { updateSupplier } from "../../action";
import { INITIAL_STATE_SUPPLIER, INITIAL_SUPPLIER } from "@/constants/supplier.constant";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { Supplier, SupplierForm, supplierFormSchema } from "@/validations/supplier-validation";

export default function EditSupplier() {
  const params = useParams();
  const supplierId = params?.id as string;
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const form = useForm<SupplierForm>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: INITIAL_SUPPLIER,
  });
  const [state, action, pending] = useActionState(updateSupplier, INITIAL_STATE_SUPPLIER);

  const { data: brands = [] } = useQuery({
    queryKey: ["supplier-brands", currentId],
    queryFn: async () => {
      const result = await supabase
        .from("brand")
        .select("id,name")
        .eq("clients_id", currentId)
        .eq("status", true)
        .order("name");
      if (result.error) throw result.error;
      return result.data ?? [];
    },
    enabled: !!currentId,
  });
  const { data: supplier, isLoading } = useQuery({
    queryKey: ["supplier", supplierId],
    queryFn: async () => {
      const result = await supabase
        .from("supplier")
        .select("*,supplier_PIC:supplier_pic(*)")
        .eq("clients_id", currentId)
        .eq("id", supplierId)
        .single();
      if (result.error) {
        toast.error("Get Supplier Data Failed", { description: result.error.message });
        throw result.error;
      }
      return result.data;
    },
    enabled: !!currentId && !!supplierId,
  });

  useEffect(() => {
    if (!supplier) return;
    form.reset({
      ...supplier,
      brand_id: String(supplier.brand_id),
      status: String(supplier.status),
      credit_terms: String(supplier.credit_terms),
      payment_method: supplier.payment_method,
      supplier_PIC: (supplier as Supplier).supplier_PIC?.map(({ name, email, phone, is_default }) => ({
        name,
        email,
        phone,
        is_default,
      })) ?? INITIAL_SUPPLIER.supplier_PIC,
    } as SupplierForm);
  }, [supplier, form]);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, typeof value === "string" ? value : JSON.stringify(value));
    });
    formData.append("id", supplierId);
    startTransition(() => action(formData));
  });

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Update Supplier Failed", { description: state.errors?._form?.[0] });
    }
    if (state.status === "success") {
      toast.success("Update Supplier Success");
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
      router.push("/master-data/supplier");
    }
  }, [state, queryClient, router]);

  if (isLoading) return <div>Loading supplier...</div>;

  return (
    <CardFormSupplier
      type="Update"
      form={form}
      brands={brands.map((brand) => ({ value: String(brand.id), label: brand.name }))}
      isPending={pending}
      onSubmit={onSubmit}
    />
  );
}

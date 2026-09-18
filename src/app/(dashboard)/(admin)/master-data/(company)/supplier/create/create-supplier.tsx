"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CardFormSupplier from "../_components/card-form-supplier";
import { createSupplier } from "../action";
import { INITIAL_STATE_SUPPLIER, INITIAL_SUPPLIER } from "@/constants/supplier.constant";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { SupplierForm, supplierFormSchema } from "@/validations/supplier-validation";

export default function CreateSupplier() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<SupplierForm>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: INITIAL_SUPPLIER,
  });
  const [state, action, pending] = useActionState(createSupplier, INITIAL_STATE_SUPPLIER);
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

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, typeof value === "string" ? value : JSON.stringify(value));
    });
    startTransition(() => action(formData));
  });

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Create Supplier Failed", { description: state.errors?._form?.[0] });
    }
    if (state.status === "success") {
      toast.success("Create Supplier Success");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
      router.push("/master-data/supplier");
    }
  }, [state, form, queryClient, router]);

  return (
    <CardFormSupplier
      type="Create"
      form={form}
      brands={brands.map((brand) => ({ value: String(brand.id), label: brand.name }))}
      isPending={pending}
      onSubmit={onSubmit}
    />
  );
}

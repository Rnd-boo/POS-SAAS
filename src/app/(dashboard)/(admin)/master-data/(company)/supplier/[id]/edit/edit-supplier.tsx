"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CardFormSupplier from "../../_components/card-form-supplier";
import { updateSupplier } from "../../action";
import {
  INITIAL_STATE_SUPPLIER,
  INITIAL_SUPPLIER,
} from "@/constants/supplier.constant";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import {
  Supplier,
  SupplierForm,
  supplierFormSchema,
} from "@/validations/supplier-validation";
import { useBrandStore } from "@/stores/brand-store";

export default function EditSupplier() {
  const params = useParams();
  const supplierId = params?.id as string;
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((state) => state.currentBrandId);
  const form = useForm<SupplierForm>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: INITIAL_SUPPLIER,
  });
  const [state, action, pending] = useActionState(
    updateSupplier,
    INITIAL_STATE_SUPPLIER,
  );

  const { data: suppliers, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ["suppliers", supplierId],

    queryFn: async () => {
      const result = await supabase
        .from("suppliers")
        .select(
          "id,name,address,city,state,country,phone,credit_terms,notes, supplier_pic!inner(name,email,phone,is_default),status,payment_method,credit_terms,bank_name,bank_account_number,bank_account_name",
          {
            count: "exact",
          },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .eq("supplier_pic.supplier_id", supplierId)
        .eq("id", supplierId)
        .single();

      if (result.error)
        toast.error("Get Supplier Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!supplierId,
  });

  useEffect(() => {
    if (!suppliers) return;

    form.setValue("name", String(suppliers.name));
    form.setValue("address", suppliers.address);
    form.setValue("city", suppliers.city);
    form.setValue("state", suppliers.state);
    form.setValue("country", suppliers.country);
    form.setValue("phone", suppliers.phone);
    form.setValue("status", suppliers.status === true ? "true" : "false");
    const supplierPIC = suppliers.supplier_pic.map((item) => ({
      name: item.name,
      email: item.email,
      phone: item.phone,
      is_default: item.is_default,
    }));
    form.setValue("supplier_PIC", supplierPIC);
    form.setValue("payment_method", suppliers.payment_method);
    form.setValue("credit_terms", suppliers.credit_terms);
    form.setValue("bank_name", suppliers.bank_name);
    form.setValue("bank_account_number", String(suppliers.bank_account_number));
    form.setValue("bank_account_name", suppliers.bank_account_name);
    form.setValue("notes", suppliers.notes);
  }, [suppliers, form]);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(
        key,
        typeof value === "string" ? value : JSON.stringify(value),
      );
    });
    formData.append("id", supplierId);
    startTransition(() => action(formData));
  });

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Update Supplier Failed", {
        description: state.errors?._form?.[0],
      });
    }
    if (state.status === "success") {
      toast.success("Update Supplier Success");
      queryClient.refetchQueries({ queryKey: ["suppliers"] });
      router.push("/master-data/supplier");
    }
  }, [state]);

  return (
    <CardFormSupplier
      type="Update"
      form={form}
      isLoading={isLoadingSuppliers}
      isPending={pending}
      onSubmit={onSubmit}
    />
  );
}

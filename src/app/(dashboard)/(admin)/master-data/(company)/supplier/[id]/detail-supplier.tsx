"use client";

import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import CardFormSupplier from "../_components/card-form-supplier";
import {
  SupplierForm,
  supplierFormSchema,
} from "@/validations/supplier-validation";
import { INITIAL_SUPPLIER } from "@/constants/supplier.constant";

export default function DetailSupplier() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const params = useParams();
  const supplierId = params?.id as string;
  const form = useForm<SupplierForm>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: INITIAL_SUPPLIER,
  });

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
    form.setValue("bank_account_number", suppliers.bank_account_number);
    form.setValue("bank_account_name", suppliers.bank_account_name);
    form.setValue("notes", suppliers.notes);
  }, [suppliers, form]);

  return (
    <CardFormSupplier
      isLoading={isLoadingSuppliers}
      form={form}
      type="Detail"
    />
  );
}

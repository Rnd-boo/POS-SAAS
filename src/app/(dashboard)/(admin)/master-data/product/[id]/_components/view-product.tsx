"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Product,
  ProductForm,
  productFormSchema,
} from "@/validations/product-validation";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { INITIAL_PRODUCT } from "@/constants/product.constant";
import FormDetail from "./form-detail";
import { Card } from "@/components/ui/card";
import { id } from "zod/v4/locales";

export default function ViewProduct() {
  const params = useParams();
  const productId = params?.id as string;
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: INITIAL_PRODUCT,
  });
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const result = await supabase
        .from("products")
        .select(
          `*,client_profiles:client_profiles_id(name), categories:categories_id(
            name
          )`
        )
        .eq("clients_id", currentId)
        .eq("id", productId)
        .single();

      if (result.error)
        toast.error("Get Product Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!productId,
  });

  useEffect(() => {
    form.setValue("name", product?.name);
    form.setValue(
      "description",
      product?.description?.trim() || "No Description"
    );
    form.setValue("status", product?.status ? "Active" : "Not Active");
    form.setValue("upc", product?.upc);
    form.setValue("categories_id", product?.categories?.name);
  }, [product, form]);

  const { data: productUnit, isLoading: isLoadingProductUnit } = useQuery({
    queryKey: ["product_units", product?.id],
    queryFn: async () => {
      const result = await supabase
        .from("product_units")
        .select(
          `id,is_base_unit, products_id, units_id, conversion_factor, units(
            name
          )`
        )
        .eq("clients_id", currentId)
        .eq("products_id", product?.id);

      if (result.error)
        toast.error("Get Product Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!product?.id,
  });

  useEffect(() => {
    if (productUnit && Array.isArray(productUnit)) {
      const formattedUnits = productUnit
        .filter((unit) => unit && unit.units && unit.conversion_factor)
        .map((unit) => ({
          units_id: (unit.units as unknown as { name: string }).name,
          conversion_factor: String(unit.conversion_factor),
        }));

      form.setValue("units", formattedUnits);
    }
  }, [productUnit, form]);

  return (
    <>
      <FormDetail
        form={form}
        isLoading={isLoadingProduct || isLoadingProductUnit}
        data={[
          { label: "Created By", value: product?.client_profiles?.name },
          { label: "Created At", value: product?.created_at },
          // { label: "Updated By", value: product?.updated_by },
          { label: "Updated At", value: product?.updated_at },
        ]}
      />
    </>
  );
}

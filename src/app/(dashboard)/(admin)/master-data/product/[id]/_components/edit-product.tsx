"use client";

import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductForm,
  productFormSchema,
} from "@/validations/product-validation";
import {
  INITIAL_PRODUCT,
  INITIAL_STATE_PRODUCT,
} from "@/constants/product.constant";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { startTransition, useActionState, useEffect } from "react";
import { updateProduct } from "../../action";
import FormProduct from "../../_components/form-product";

export default function EditProduct() {
  const { id } = useParams();
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: INITIAL_PRODUCT,
  });

  const [updateProductState, updateProductAction, isPendingUpdateProduct] =
    useActionState(updateProduct, INITIAL_STATE_PRODUCT);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("id", String(id));

    Object.entries(data).forEach(([key, value]) => {
      if (key === "units") {
        // serialize units array into JSON
        formData.append("units", JSON.stringify(value));
      } else {
        formData.append(key, String(value ?? ""));
      }
    });

    startTransition(() => {
      updateProductAction(formData);
    });
  });

  const { data: product } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const result = await supabase
        .from("products")
        .select(`*,client_profiles:client_profiles_id(name)`)
        .eq("clients_id", currentId)
        .eq("id", id)
        .single();

      if (result.error)
        toast.error("Get Product Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!id,
  });

  const { data: productUnit } = useQuery({
    queryKey: ["product_units", product?.id],
    queryFn: async () => {
      const result = await supabase
        .from("product_units")
        .select(
          `id,is_base_unit, products_id, units_id, conversion_factor,is_sales_unit, units:units_id(
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
    if (productUnit) {
      if (productUnit && Array.isArray(productUnit)) {
        const formattedUnits = productUnit.map((unit) => ({
          units_id: String(unit.units_id),
          conversion_factor: String(unit.conversion_factor),
          base_unit: unit.is_base_unit,
          is_sales_unit: unit.is_sales_unit,
        }));

        form.reset({
          name: product.name || "",
          description: product.description || "",
          categories_id: product.categories_id?.toString() || "",
          status: product.status?.toString() || "",
          upc: product.upc || "",
          units: formattedUnits,
        });
      }
    }
  }, [product, productUnit, form]);

  useEffect(() => {
    if (updateProductState?.status === "error") {
      toast.error("Update Product Failed", {
        description: updateProductState.errors?._form?.[0],
      });
    }
    if (updateProductState?.status === "success") {
      toast.success("Update Product Success");
      queryClient.refetchQueries({ queryKey: ["products"] });
      queryClient.refetchQueries({ queryKey: ["product_units"] });
      router.push("/master-data/product");
    }
  }, [updateProductState]);

  return (
    <>
      <FormProduct
        form={form}
        onSubmit={onSubmit}
        isPending={isPendingUpdateProduct}
        type="Update"
      />
    </>
  );
}

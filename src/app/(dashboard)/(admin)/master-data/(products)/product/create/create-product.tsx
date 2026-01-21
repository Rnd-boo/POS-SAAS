"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProduct } from "../action";
import {
  ProductForm,
  productFormSchema,
  ProductUnit,
} from "@/validations/product-validation";
import {
  INITIAL_PRODUCT,
  INITIAL_STATE_PRODUCT,
} from "@/constants/product.constant";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import FormProduct from "../_components/form-product";
import { useBrandStore } from "@/stores/brand-store";

export default function CreateProduct() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: INITIAL_PRODUCT,
  });

  const [createProductState, createProductAction, isPendingcreateProduct] =
    useActionState(createProduct, INITIAL_STATE_PRODUCT);

  const onSubmit = form.handleSubmit(
    async (data) => {
      // Debug: Log the form data
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "units") {
          formData.append("units", JSON.stringify(value));
        } else {
          formData.append(key, String(value ?? ""));
        }
        formData.append("brand_id", String(currentBrandId));
      });

      startTransition(() => {
        createProductAction(formData);
      });
      console.log(formData);
    },
    (errors) => {
      console.log(errors);
    },
  );

  useEffect(() => {
    if (createProductState?.status === "error") {
      toast.error("Create Product Failed", {
        description: createProductState.errors?._form?.[0],
      });
    }
    if (createProductState?.status === "success") {
      toast.success("Create Product Success");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["products"] });
      router.push("/master-data/product");
    }
  }, [createProductState]);

  return (
    <FormProduct
      form={form}
      onSubmit={onSubmit}
      isPending={isPendingcreateProduct}
      type="Create"
    />
  );
}

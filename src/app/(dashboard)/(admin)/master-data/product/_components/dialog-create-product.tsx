import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProduct } from "../action";
import {
  ProductForm,
  productFormSchema,
} from "@/validations/product-validation";
import {
  INITIAL_PRODUCT,
  INITIAL_STATE_PRODUCT,
} from "@/constants/product.constant";
import FormProduct from "./form-product";

export default function DialogCreateProduct({
  refetch,
}: {
  refetch: () => void;
}) {
  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: INITIAL_PRODUCT,
  });

  const [createProductState, createProductAction, isPendingcreateProduct] =
    useActionState(createProduct, INITIAL_STATE_PRODUCT);

  const onSubmit = form.handleSubmit(async (data) => {
    // Debug: Log the form data

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createProductAction(formData);
    });
  });

  useEffect(() => {
    if (createProductState?.status === "error") {
      toast.error("Create Product Failed", {
        description: createProductState.errors?._form?.[0],
      });
    }
    if (createProductState?.status === "success") {
      toast.success("Create Product Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createProductState]);

  return (
    <FormProduct
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingcreateProduct}
      type="Create"
    />
  );
}

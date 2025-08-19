import {
  INITIAL_CATEGORY,
  INITIAL_STATE_CATEGORY,
} from "@/constants/category.constant";
import {
  CategoryForm,
  categoryFormSchema,
} from "@/validations/category-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createCategory } from "../action";
import FormCategory from "./form-category";

export default function DialogCreateCategory({
  refetch,
}: {
  refetch: () => void;
}) {
  const form = useForm<CategoryForm>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: INITIAL_CATEGORY,
  });

  const [createCategoryState, createCategoryAction, isPendingcreateCategory] =
    useActionState(createCategory, INITIAL_STATE_CATEGORY);

  const onSubmit = form.handleSubmit(async (data) => {
    // Debug: Log the form data

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Debug: Log FormData contents
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    startTransition(() => {
      createCategoryAction(formData);
    });
  });

  useEffect(() => {
    if (createCategoryState?.status === "error") {
      toast.error("Create Category Failed", {
        description: createCategoryState.errors?._form?.[0],
      });
    }
    if (createCategoryState?.status === "success") {
      toast.success("Create Category Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createCategoryState]);

  return (
    <FormCategory
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingcreateCategory}
      type="Create"
    />
  );
}

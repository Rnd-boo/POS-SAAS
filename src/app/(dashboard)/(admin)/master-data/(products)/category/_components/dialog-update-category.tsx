import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { updateCategory } from "../action";
import {
  Category,
  CategoryForm,
  categoryFormSchema,
} from "@/validations/category-validation";
import { INITIAL_STATE_CATEGORY } from "@/constants/category.constant";
import FormCategory from "./form-category";

export default function DialogUpdateCategory({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: {
  refetch: () => void;
  currentData?: Category;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<CategoryForm>({
    resolver: zodResolver(categoryFormSchema),
  });

  const [updateCategoryState, updateCategoryAction, isPendingUpdateCategory] =
    useActionState(updateCategory, INITIAL_STATE_CATEGORY);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("id", currentData?.id ?? "");
    startTransition(() => {
      updateCategoryAction(formData);
    });
  });

  useEffect(() => {
    if (updateCategoryState?.status === "error") {
      toast.error("Update Category Failed", {
        description: updateCategoryState.errors?._form?.[0],
      });
    }
    if (updateCategoryState?.status === "success") {
      toast.success("Update Category Success");
      form.reset();
      handleChangeAction?.(false);
      refetch();
    }
  }, [updateCategoryState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name);
      form.setValue("description", currentData.description ?? "");
      form.setValue("status", currentData.status.toString());
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormCategory
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateCategory}
        type="Update"
      />
    </Dialog>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { INITIAL_STATE_ORDER_CONTEXT } from "@/constants/pos/order-context";
import { updateMenuCategory } from "../action";
import { useBrandStore } from "@/stores/brand-store";
import {
  MenuCategory,
  MenuCategoryForm,
  menuCategoryFormSchema,
} from "@/validations/pos/menu-category.validation";
import FormMenuCategory from "./form-menu-category";

export default function DialogUpdateMenuCategory({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: {
  refetch: () => void;
  currentData?: MenuCategory;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const currentBrandId = useBrandStore((s) => s.currentBrandId);

  const form = useForm<MenuCategoryForm>({
    resolver: zodResolver(menuCategoryFormSchema),
  });

  const [
    updateMenuCategoryState,
    updateMenuCategoryAction,
    isPendingUpdateMenuCategory,
  ] = useActionState(updateMenuCategory, INITIAL_STATE_ORDER_CONTEXT);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("brand_id", String(currentBrandId));
    formData.append("id", currentData?.id ?? "");
    startTransition(() => {
      updateMenuCategoryAction(formData);
    });
  });

  useEffect(() => {
    if (updateMenuCategoryState?.status === "error") {
      toast.error("Update Menu Category Failed", {
        description: updateMenuCategoryState.errors?._form?.[0],
      });
    }
    if (updateMenuCategoryState?.status === "success") {
      toast.success("Update Menu Category Success");
      form.reset();
      handleChangeAction?.(false);
      refetch();
    }
  }, [updateMenuCategoryState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name);
      form.setValue("status", currentData.status.toString());
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormMenuCategory
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateMenuCategory}
        type="Update"
      />
    </Dialog>
  );
}

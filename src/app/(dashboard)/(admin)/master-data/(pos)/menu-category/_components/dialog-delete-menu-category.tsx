"use client";

import { toast } from "sonner";
import DialogDelete from "@/components/common/dialog/dialog-delete";
import { INITIAL_STATE_ORDER_CONTEXT } from "@/constants/pos/order-context";
import { startTransition, useActionState, useEffect } from "react";
import { MenuCategory } from "@/validations/pos/menu-category.validation";
import { deleteMenuCategory } from "../action";

export default function DialogDeleteMenuCategory({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: MenuCategory;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [
    deleteMenuCategoryState,
    deleteMenuCategoryAction,
    isPendingDeleteMenuCategory,
  ] = useActionState(deleteMenuCategory, INITIAL_STATE_ORDER_CONTEXT);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteMenuCategoryAction(formData);
    });
  };

  useEffect(() => {
    if (deleteMenuCategoryState?.status === "error") {
      toast.error("Delete MenuCategory Failed", {
        description: deleteMenuCategoryState.errors?._form?.[0],
      });
    }
    if (deleteMenuCategoryState?.status === "success") {
      toast.success("Delete MenuCategory Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteMenuCategoryState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteMenuCategory}
      onSubmit={onSubmit}
      title="Menu Category"
    />
  );
}

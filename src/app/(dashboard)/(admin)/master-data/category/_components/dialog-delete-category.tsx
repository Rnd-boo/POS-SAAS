import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { deleteCategory } from "../action";
import { Category } from "@/validations/category-validation";
import { INITIAL_STATE_CATEGORY } from "@/constants/category.constant";
import DialogDelete from "@/components/common/dialog-delete";

export default function DialogDeleteCategory({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Category;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteCategoryState, deleteCategoryAction, isPendingDeleteCategory] =
    useActionState(deleteCategory, INITIAL_STATE_CATEGORY);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteCategoryAction(formData);
    });
  };

  useEffect(() => {
    if (deleteCategoryState?.status === "error") {
      toast.error("Delete Category Failed", {
        description: deleteCategoryState.errors?._form?.[0],
      });
    }
    if (deleteCategoryState?.status === "success") {
      toast.success("Delete Category Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteCategoryState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteCategory}
      onSubmit={onSubmit}
      title="Category"
    />
  );
}

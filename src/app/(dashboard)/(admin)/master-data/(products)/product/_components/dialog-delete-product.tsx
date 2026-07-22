import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import DialogDelete from "@/components/common/dialog/dialog-delete";
import { Product } from "@/validations/products/product-validation";
import { INITIAL_STATE_PRODUCT } from "@/constants/products/product.constant";
import { deleteProduct } from "../action";

export default function DialogDeleteProduct({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Product;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteProductState, deleteProductAction, isPendingDeleteProduct] =
    useActionState(deleteProduct, INITIAL_STATE_PRODUCT);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteProductAction(formData);
    });
  };

  useEffect(() => {
    if (deleteProductState?.status === "error") {
      toast.error("Delete Product Failed", {
        description: deleteProductState.errors?._form?.[0],
      });
    }
    if (deleteProductState?.status === "success") {
      toast.success("Delete Product Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteProductState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteProduct}
      onSubmit={onSubmit}
      title="Product"
    />
  );
}

"use client";

import { toast } from "sonner";
import { OrderContext } from "@/validations/pos/order-context.validation";
import { deleteOrderContext } from "../action";
import { INITIAL_STATE_ORDER_CONTEXT } from "@/constants/pos/order-context";
import { startTransition, useActionState, useEffect } from "react";
import { AlertDialogDelete } from "@/components/common/dialog/dialog-delete";

export default function DialogDeleteOrderContext({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: OrderContext;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [
    deleteOrderContextState,
    deleteOrderContextAction,
    isPendingDeleteOrderContext,
  ] = useActionState(deleteOrderContext, INITIAL_STATE_ORDER_CONTEXT);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteOrderContextAction(formData);
    });
  };

  useEffect(() => {
    if (deleteOrderContextState?.status === "error") {
      toast.error("Delete OrderContext Failed", {
        description: deleteOrderContextState.errors?._form?.[0],
      });
    }
    if (deleteOrderContextState?.status === "success") {
      toast.success("Delete OrderContext Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteOrderContextState]);

  return (
    <AlertDialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteOrderContext}
      onSubmit={onSubmit}
      title="Order Context"
      name={currentData?.name as string}
    />
  );
}

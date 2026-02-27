import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import DialogDelete from "@/components/common/dialog-delete";
import { INITIAL_STATE_PRODUCTION_ORDER } from "@/constants/production/production-order.constant";
import { ProductionOrder } from "@/validations/production/production-order.validation";
import { deleteProductionOrder } from "../action";

export default function DialogDeleteProductionOrder({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: ProductionOrder;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [
    deleteProductionOrderState,
    deleteProductionOrderAction,
    isPendingDeleteProductionOrder,
  ] = useActionState(deleteProductionOrder, INITIAL_STATE_PRODUCTION_ORDER);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteProductionOrderAction(formData);
    });
  };

  useEffect(() => {
    if (deleteProductionOrderState?.status === "error") {
      toast.error("Delete Production Order Failed", {
        description: deleteProductionOrderState.errors?._form?.[0],
      });
    }
    if (deleteProductionOrderState?.status === "success") {
      toast.success("Delete Production Order Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteProductionOrderState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteProductionOrder}
      onSubmit={onSubmit}
      title="Production Order"
    />
  );
}

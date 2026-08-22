import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import DialogDelete from "@/components/common/dialog/dialog-delete";
import { INITIAL_STATE_STOCK_ADJUSTMENT } from "@/constants/inventory/stock-adjustment.constant";
import { StockAdjustment } from "@/validations/inventory/stock-adjustment.validation";
import { deleteStockAdjustment } from "../action";

export default function DialogDeleteStockAdjustment({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: StockAdjustment;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [
    deleteStockAdjustmentState,
    deleteStockAdjustmentAction,
    isPendingDeleteStockAdjustment,
  ] = useActionState(deleteStockAdjustment, INITIAL_STATE_STOCK_ADJUSTMENT);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteStockAdjustmentAction(formData);
    });
  };

  useEffect(() => {
    if (deleteStockAdjustmentState?.status === "error") {
      toast.error("Delete Stock Adjustment Failed", {
        description: deleteStockAdjustmentState.errors?._form?.[0],
      });
    }
    if (deleteStockAdjustmentState?.status === "success") {
      toast.success("Delete Stock Adjustment Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteStockAdjustmentState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteStockAdjustment}
      onSubmit={onSubmit}
      title="Stock Adjustment"
    />
  );
}

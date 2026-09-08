import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Unit } from "@/validations/products/unit-validation";
import { deleteUnit } from "../action";
import { INITIAL_STATE_UNIT } from "@/constants/products/unit.constant";
import { AlertDialogDelete } from "@/components/common/dialog/dialog-delete";

export default function DialogDeleteUnit({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Unit;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteUnitState, deleteUnitAction, isPendingDeleteUnit] =
    useActionState(deleteUnit, INITIAL_STATE_UNIT);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteUnitAction(formData);
    });
  };

  useEffect(() => {
    if (deleteUnitState?.status === "error") {
      toast.error("Delete Unit Failed", {
        description: deleteUnitState.errors?._form?.[0],
      });
    }
    if (deleteUnitState?.status === "success") {
      toast.success("Delete Unit Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteUnitState]);

  return (
    <AlertDialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteUnit}
      onSubmit={onSubmit}
      title="Unit"
      name={currentData?.name as string}
    />
  );
}

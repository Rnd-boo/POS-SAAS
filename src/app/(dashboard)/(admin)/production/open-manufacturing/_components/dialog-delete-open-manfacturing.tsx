import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import DialogDelete from "@/components/common/dialog-delete";
import { OpenManufacturing } from "@/validations/production/open-manufacturing.validation";
import { deleteOpenManufacturing } from "../action";
import { INITIAL_STATE_OPEN_MANUFACTURING } from "@/constants/production/open-manufacturing.constant";

export default function DialogDeleteOpenManufacturing({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: OpenManufacturing;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [
    deleteOpenManufacturingState,
    deleteOpenManufacturingAction,
    isPendingDeleteOpenManufacturing,
  ] = useActionState(deleteOpenManufacturing, INITIAL_STATE_OPEN_MANUFACTURING);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteOpenManufacturingAction(formData);
    });
  };

  useEffect(() => {
    if (deleteOpenManufacturingState?.status === "error") {
      toast.error("Delete Open Manufacturing Failed", {
        description: deleteOpenManufacturingState.errors?._form?.[0],
      });
    }
    if (deleteOpenManufacturingState?.status === "success") {
      toast.success("Delete Open Manufacturing Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteOpenManufacturingState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteOpenManufacturing}
      onSubmit={onSubmit}
      title="Open Manufacturing"
    />
  );
}

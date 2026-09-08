import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { deleteProductionProcess } from "../action";
import { INITIAL_STATE_PRODUCTION_PROCESS } from "@/constants/production/production-process.constant";
import { ProductionProcess } from "@/validations/production/production-process.validation";
import { AlertDialogDelete } from "@/components/common/dialog/dialog-delete";

export default function DialogDeleteProductionProcess({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: ProductionProcess;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [
    deleteProductionProcessState,
    deleteProductionProcessAction,
    isPendingDeleteProductionProcess,
  ] = useActionState(deleteProductionProcess, INITIAL_STATE_PRODUCTION_PROCESS);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteProductionProcessAction(formData);
    });
  };

  useEffect(() => {
    if (deleteProductionProcessState?.status === "error") {
      toast.error("Delete Production Process Failed", {
        description: deleteProductionProcessState.errors?._form?.[0],
      });
    }
    if (deleteProductionProcessState?.status === "success") {
      toast.success("Delete Production Process Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteProductionProcessState]);

  return (
    <AlertDialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteProductionProcess}
      onSubmit={onSubmit}
      title="Production Process"
      name={currentData?.id as string}
    />
  );
}

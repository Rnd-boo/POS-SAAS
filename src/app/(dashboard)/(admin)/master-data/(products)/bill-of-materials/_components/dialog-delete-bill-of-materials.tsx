import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { INITIAL_STATE_BOM } from "@/constants/products/bill-of-materials.constant";
import { deleteBillOfMaterials } from "../action";
import { BillOfMaterials } from "@/validations/products/bill-of-materials-validation";
import { AlertDialogDelete } from "@/components/common/dialog/dialog-delete";

export default function DialogDeleteBillOfMaterials({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: BillOfMaterials;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteBOMState, deleteBOMAction, isPendingDeleteBOM] = useActionState(
    deleteBillOfMaterials,
    INITIAL_STATE_BOM,
  );

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteBOMAction(formData);
    });
  };

  useEffect(() => {
    if (deleteBOMState?.status === "error") {
      toast.error("Delete Bill Of Materials Failed", {
        description: deleteBOMState.errors?._form?.[0],
      });
    }
    if (deleteBOMState?.status === "success") {
      toast.success("Delete  Bill Of Materials  Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteBOMState]);

  return (
    <AlertDialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteBOM}
      onSubmit={onSubmit}
      title="Bill of materials"
      name={currentData?.name as string}
    />
  );
}

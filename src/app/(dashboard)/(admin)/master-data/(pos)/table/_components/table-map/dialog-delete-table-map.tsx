import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import DialogDelete from "@/components/common/dialog-delete";
import { deleteTableMap } from "../../action";
import { INITIAL_STATE_TABLE_MAP } from "@/constants/(pos)/table-map.constant";
import { Table } from "@/validations/(pos)/table-map.validation";

export default function DialogDeleteTableMap({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Table;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteTableMapState, deleteTableMapAction, isPendingDeleteTableMap] =
    useActionState(deleteTableMap, INITIAL_STATE_TABLE_MAP);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteTableMapAction(formData);
    });
  };

  useEffect(() => {
    if (deleteTableMapState?.status === "error") {
      toast.error("Delete TableMap Failed", {
        description: deleteTableMapState.errors?._form?.[0],
      });
    }
    if (deleteTableMapState?.status === "success") {
      toast.success("Delete TableMap Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteTableMapState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteTableMap}
      onSubmit={onSubmit}
      title="Table Map"
    />
  );
}

"use client";

import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { AlertDialogDelete } from "@/components/common/dialog/dialog-delete";
import { INITIAL_STATE_SUPPLIER } from "@/constants/supplier.constant";
import { deleteSupplier } from "../action";
import { SupplierData } from "@/types/supplier";

export default function DialogDeleteSupplier({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  open: boolean;
  refetch: () => void;
  currentData?: SupplierData;
  handleChangeAction: (open: boolean) => void;
}) {
  const [state, action, pending] = useActionState(
    deleteSupplier,
    INITIAL_STATE_SUPPLIER,
  );
  useEffect(() => {
    if (state.status === "error")
      toast.error("Delete Supplier Failed", {
        description: state.errors?._form?.[0],
      });
    if (state.status === "success") {
      toast.success("Delete Supplier Success");
      handleChangeAction(false);
      refetch();
    }
  }, [state, refetch, handleChangeAction]);
  return (
    <AlertDialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={pending}
      onSubmit={() => {
        const data = new FormData();
        data.append("id", currentData?.id ?? "");
        startTransition(() => action(data));
      }}
      title="Supplier"
      name={currentData?.name ?? ""}
    />
  );
}

import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import DialogDelete from "@/components/common/dialog-delete";
import { INITIAL_STATE_BRANCH } from "@/constants/branch.constant";
import { Branch } from "@/validations/branch.validation";
import { deleteBranch } from "../action";

export default function DialogDeleteBranch({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Branch;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteBranchState, deleteBranchAction, isPendingDeleteBranch] =
    useActionState(deleteBranch, INITIAL_STATE_BRANCH);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteBranchAction(formData);
    });
  };

  useEffect(() => {
    if (deleteBranchState?.status === "error") {
      toast.error("Delete Branch Failed", {
        description: deleteBranchState.errors?._form?.[0],
      });
    }
    if (deleteBranchState?.status === "success") {
      toast.success("Delete Branch Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteBranchState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteBranch}
      onSubmit={onSubmit}
      title="Branch"
    />
  );
}

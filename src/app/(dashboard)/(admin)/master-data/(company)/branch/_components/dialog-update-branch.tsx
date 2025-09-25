import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import {
  Branch,
  BranchForm,
  branchFormSchema,
} from "@/validations/branch.validation";
import { INITIAL_STATE_BRANCH } from "@/constants/branch.constant";
import FormBranch from "./form-branch";
import { updateBranch } from "../action";

export default function DialogUpdateBranch({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: {
  refetch: () => void;
  currentData?: Branch;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<BranchForm>({
    resolver: zodResolver(branchFormSchema),
  });

  const [updateBranchState, updateBranchAction, isPendingUpdateBranch] =
    useActionState(updateBranch, INITIAL_STATE_BRANCH);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("id", currentData?.id ?? "");
    startTransition(() => {
      updateBranchAction(formData);
    });
  });

  useEffect(() => {
    if (updateBranchState?.status === "error") {
      toast.error("Update Branch Failed", {
        description: updateBranchState.errors?._form?.[0],
      });
    }
    if (updateBranchState?.status === "success") {
      toast.success("Update Branch Success");
      form.reset();
      handleChangeAction?.(false);
      refetch();
    }
  }, [updateBranchState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name);
      form.setValue("brand_id", String(currentData.brand_id));
      form.setValue("status", currentData.status.toString());
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormBranch
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateBranch}
        type="Update"
      />
    </Dialog>
  );
}

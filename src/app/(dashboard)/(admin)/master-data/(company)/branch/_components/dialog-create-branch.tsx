import {
  INITIAL_BRANCH,
  INITIAL_STATE_BRANCH,
} from "@/constants/branch.constant";
import { BranchForm, branchFormSchema } from "@/validations/branch.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormBranch from "./form-branch";
import { createBranch } from "../action";
import { useBrandStore } from "@/stores/brand-store";

export default function DialogCreateBranch({
  refetch,
}: {
  refetch: () => void;
}) {
  const currentBrandId = useBrandStore((s) => s.currentBrandId);

  const form = useForm<BranchForm>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: INITIAL_BRANCH,
  });

  const [createBranchState, createBranchAction, isPendingcreateBranch] =
    useActionState(createBranch, INITIAL_STATE_BRANCH);

  const onSubmit = form.handleSubmit(async (data) => {
    // Debug: Log the form data

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createBranchAction(formData);
    });
  });

  useEffect(() => {
    if (createBranchState?.status === "error") {
      toast.error("Create Branch Failed", {
        description: createBranchState.errors?._form?.[0],
      });
    }
    if (createBranchState?.status === "success") {
      toast.success("Create Branch Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createBranchState]);

  useEffect(() => {
    form.setValue("brand_id", String(currentBrandId));
  });

  return (
    <FormBranch
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingcreateBranch}
      type="Create"
    />
  );
}

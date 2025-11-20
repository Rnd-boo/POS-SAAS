"use client";

import { BranchForm, branchFormSchema } from "@/validations/branch.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  INITIAL_BRANCH,
  INITIAL_STATE_BRANCH,
} from "@/constants/branch.constant";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useBrandStore } from "@/stores/brand-store";
import { createBranch } from "../action";
import CardFormBranch from "../_components/card-form-branch";

export default function CreateBranch() {
  const router = useRouter();
  const queryClient = useQueryClient();
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
      if (key === "branch_order_context") {
        formData.append("branch_order_context", JSON.stringify(value));
      } else if (key === "branch_location") {
        formData.append("branch_location", JSON.stringify(value));
      } else {
        formData.append(key, String(value ?? ""));
      }
    });
    formData.append("brand_id", String(currentBrandId));
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
      queryClient.refetchQueries({ queryKey: ["branch"] });
      router.push("/master-data/branch");
    }
  }, [createBranchState]);

  return (
    <CardFormBranch
      type="Create"
      form={form}
      isPending={isPendingcreateBranch}
      onSubmit={onSubmit}
    />
  );
}

"use client";

import { useForm } from "react-hook-form";
import CardFormBranch from "../../_components/card-form-branch";
import { BranchForm, branchFormSchema } from "@/validations/branch.validation";
import {
  INITIAL_BRANCH,
  INITIAL_STATE_BRANCH,
} from "@/constants/branch.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { startTransition, useActionState, useEffect } from "react";
import { updateBranch } from "../../action";

export default function EditBranch() {
  const params = useParams();
  const branchId = params?.id as string;
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<BranchForm>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: INITIAL_BRANCH,
  });

  const { data: branch } = useQuery({
    queryKey: ["branch", branchId],
    queryFn: async () => {
      const result = await supabase
        .from("branch")
        .select("id,name,status,client_profiles:client_profiles_id(username)")
        .eq("clients_id", currentId)
        .eq("id", branchId)
        .eq("brand_id", currentBrandId)
        .single();

      if (result.error)
        toast.error("Get Branch Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!branchId,
  });

  const { data: branchLocation } = useQuery({
    queryKey: ["branch_location", branchId],
    queryFn: async () => {
      const result = await supabase
        .from("branch_location")
        .select("id,name,type")
        .eq("clients_id", currentId)
        .eq("branch_id", branchId);

      if (result.error)
        toast.error("Get Branch Location Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!branchId,
  });

  const { data: branchOrderContext } = useQuery({
    queryKey: ["branch_order_context", branchId],
    queryFn: async () => {
      const result = await supabase
        .from("branch_order_context")
        .select(
          "id,branch_id,order_context:order_context_id(id,name,tax_value,tax_name,other_tax_value,other_tax_name)"
        )
        .eq("clients_id", currentId)
        .eq("branch_id", branchId);

      if (result.error)
        toast.error("Get Branch Location Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!branchId,
  });

  useEffect(() => {
    form.setValue("name", branch?.name);
    form.setValue("status", branch?.status ? "true" : "false");

    if (branchOrderContext) {
      const formattedbranchOrderContext = branchOrderContext.map((item) => ({
        order_context: String(
          (item.order_context as unknown as { id: string }).id
        ),
        branch_id: String(item.branch_id),
      }));

      form.setValue("branch_order_context", formattedbranchOrderContext);
    }
    if (branchLocation) {
      const formattedBranchLocation = branchLocation.map((location) => ({
        name: location.name,
        type: location.type,
      }));

      form.setValue("branch_location", formattedBranchLocation);
    }
  }, [branch, branchOrderContext, branchLocation, form]);

  const [updateBranchState, updateBranchAction, isPendingUpdateBranch] =
    useActionState(updateBranch, INITIAL_STATE_BRANCH);

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
    formData.append("id", String(branchId));
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
      queryClient.refetchQueries({ queryKey: ["branch"] });
      queryClient.refetchQueries({ queryKey: ["branch_location"] });
      queryClient.refetchQueries({ queryKey: ["branch_order_context"] });
      router.push("/master-data/branch");
    }
  }, [updateBranchState]);
  return (
    <CardFormBranch
      type="Update"
      form={form}
      onSubmit={onSubmit}
      isPending={isPendingUpdateBranch}
    />
  );
}

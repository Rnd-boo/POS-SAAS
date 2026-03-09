"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { toast } from "sonner";
import { startTransition, useActionState, useEffect } from "react";
import {
  ProductionProcessForm,
  productionProcessFormSchema,
} from "@/validations/production/production-process.validation";
import {
  INITIAL_PRODUCTION_PROCESS,
  INITIAL_STATE_PRODUCTION_PROCESS,
} from "@/constants/production/production-process.constant";
import CardFormProductionProcess from "../../_components/card-form-production-process";
import { updateProductionProcess } from "../../action";

export default function EditProductionProcess() {
  const params = useParams();
  const productionProcessId = params.id;
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<ProductionProcessForm>({
    resolver: zodResolver(productionProcessFormSchema),
    defaultValues: INITIAL_PRODUCTION_PROCESS,
  });

  const [
    updateProductionProcessState,
    updateProductionProcessAction,
    isPendingUpdateProductionProcess,
  ] = useActionState(updateProductionProcess, INITIAL_STATE_PRODUCTION_PROCESS);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formData.append("id", String(productionProcessId));
    startTransition(() => {
      updateProductionProcessAction(formData);
    });
  });

  const { data: productionProcesses, isLoading: isLoadingProductionProcesses } =
    useQuery({
      queryKey: ["production_process", productionProcessId],

      queryFn: async () => {
        const result = await supabase
          .from("production_process")
          .select(
            `id, production_process_date, production_orders_id, branch_id, branch(name), notes, status, qty, branch_location_id`,
          )
          .eq("clients_id", currentId)
          .eq("brand_id", currentBrandId)
          .eq("id", productionProcessId)
          .single();

        if (result.error)
          toast.error("Get Production Process Data Failed", {
            description: result.error.message,
          });

        return result.data;
      },
      enabled: !!currentId && !!productionProcessId,
    });

  useEffect(() => {
    if (!productionProcesses) return;

    form.reset({
      branch_id: String(productionProcesses.branch_id ?? ""),
      production_process_date:
        productionProcesses.production_process_date ?? "",
      branch_location_id: String(productionProcesses.branch_location_id) ?? "",
      production_orders_id: productionProcesses.production_orders_id
        ? String(productionProcesses.production_orders_id)
        : "",
      qty: String(productionProcesses.qty ?? ""),
      notes: productionProcesses.notes ?? "",
      status: productionProcesses.status ?? "",
    });
  }, [productionProcesses, form, productionProcessId]);

  useEffect(() => {
    if (updateProductionProcessState?.status === "error") {
      toast.error("Create Production Process Failed", {
        description: updateProductionProcessState.errors?._form?.[0],
      });
    }
    if (updateProductionProcessState?.status === "success") {
      toast.success("Create Production Process Success");
      queryClient.refetchQueries({ queryKey: ["production_process"] });
      router.push("/production/process");
    }
  }, [updateProductionProcessState]);

  return (
    <CardFormProductionProcess
      type="Update"
      form={form}
      onSubmit={onSubmit}
      isPending={isPendingUpdateProductionProcess}
      isLoading={isLoadingProductionProcesses}
    />
  );
}

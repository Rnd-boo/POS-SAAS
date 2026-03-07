"use client";

import { useForm } from "react-hook-form";
import CardFormProductionProcess from "../../_components/card-form-production-process";
import {
  ProductionProcessForm,
  productionProcessFormSchema,
} from "@/validations/production/production-process.validation";
import {
  INITIAL_PRODUCTION_PROCESS,
  INITIAL_STATE_PRODUCTION_PROCESS,
} from "@/constants/production/production-process.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import {
  authorizeProductionProcess,
  rejectProductionProcess,
} from "../../action";

export default function AuthorizeProductionProcess() {
  const params = useParams();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const supabase = createClient();
  const productionProcessId = params?.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<ProductionProcessForm>({
    resolver: zodResolver(productionProcessFormSchema),
    defaultValues: INITIAL_PRODUCTION_PROCESS,
  });

  const [
    authorizeProductionProcessState,
    authorizeProductionProcessAction,
    isPendingauthorizeProductionProcess,
  ] = useActionState(
    authorizeProductionProcess,
    INITIAL_STATE_PRODUCTION_PROCESS,
  );

  const [rejectState, rejectAction] = useActionState(
    rejectProductionProcess,
    INITIAL_STATE_PRODUCTION_PROCESS,
  );

  const onSubmit = form.handleSubmit(async () => {
    const formData = new FormData();
    formData.append("id", String(productionProcessId));
    startTransition(() => {
      authorizeProductionProcessAction(formData);
    });
  });

  const handleReject = () => {
    const formData = new FormData();
    formData.append("id", String(productionProcessId));

    startTransition(() => {
      rejectAction(formData);
    });
  };

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
    if (authorizeProductionProcessState?.status === "error") {
      toast.error("Create Production Process Failed", {
        description: authorizeProductionProcessState.errors?._form?.[0],
      });
    }
    if (authorizeProductionProcessState?.status === "success") {
      toast.success("Create Production Process Success");
      queryClient.refetchQueries({ queryKey: ["production_process"] });
      router.push("/production/process");
    }
  }, [authorizeProductionProcessState]);

  useEffect(() => {
    if (rejectState?.status === "error") {
      toast.error("Reject Production Process Failed", {
        description: rejectState.errors?._form?.[0],
      });
    }
    if (rejectState?.status === "success") {
      toast.success("Reject Production Process Success");
      queryClient.refetchQueries({ queryKey: ["production_process"] });
      router.push("/production/process");
    }
  }, [rejectState]);
  return (
    <div className="w-full">
      <CardFormProductionProcess
        handleReject={handleReject}
        onSubmit={onSubmit}
        form={form}
        type="Authorize"
        isLoading={isLoadingProductionProcesses}
        isPending={isPendingauthorizeProductionProcess}
      />
    </div>
  );
}

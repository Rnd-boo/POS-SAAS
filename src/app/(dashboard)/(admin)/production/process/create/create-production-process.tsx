"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  ProductionProcessForm,
  productionProcessFormSchema,
} from "@/validations/production/production-process.validation";
import {
  INITIAL_PRODUCTION_PROCESS,
  INITIAL_STATE_PRODUCTION_PROCESS,
} from "@/constants/production/production-process.constant";
import CardFormProductionProcess from "../_components/card-form-production-process";
import { createProductionProcess } from "../action";

export default function CreateProductionProcess() {
  const queryClient = useQueryClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<ProductionProcessForm>({
    resolver: zodResolver(productionProcessFormSchema),
    defaultValues: INITIAL_PRODUCTION_PROCESS,
  });

  const [
    createProductionProcessState,
    createProductionProcessAction,
    isPendingcreateProductionProcess,
  ] = useActionState(createProductionProcess, INITIAL_STATE_PRODUCTION_PROCESS);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
      formData.append("brand_id", String(currentBrandId));
    });
    startTransition(() => {
      createProductionProcessAction(formData);
    });
  });
  useEffect(() => {
    if (createProductionProcessState?.status === "error") {
      toast.error("Create Production Process Failed", {
        description: createProductionProcessState.errors?._form?.[0],
      });
    }
    if (createProductionProcessState?.status === "success") {
      toast.success("Create Production Process Success");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["production_process"] });
      router.push("/production/process");
    }
  }, [createProductionProcessState]);

  useEffect(() => {
    form.reset(INITIAL_PRODUCTION_PROCESS);
  }, [currentBrandId]);
  return (
    <div className="w-full">
      <CardFormProductionProcess
        form={form}
        type="Create"
        onSubmit={onSubmit}
      />
    </div>
  );
}

"use client";

import { INITIAL_PRODUCTION_PROCESS } from "@/constants/production/production-process.constant";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import {
  ProductionProcessForm,
  productionProcessFormSchema,
} from "@/validations/production/production-process.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CardFormProductionProcess from "../../_components/card-form-production-process";

export default function DetailProductionProcess() {
  const params = useParams();
  const productionProcessId = params?.id as string;
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);

  const form = useForm<ProductionProcessForm>({
    resolver: zodResolver(productionProcessFormSchema),
    defaultValues: INITIAL_PRODUCTION_PROCESS,
  });

  const { data: productionProcesses, isLoading: isLoadingProductionProcesses } =
    useQuery({
      queryKey: ["production_process_detail", productionProcessId],

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
      branch_location_id: productionProcesses.branch_location_id ?? "",
      production_orders_id: productionProcesses.production_orders_id
        ? String(productionProcesses.production_orders_id)
        : "",
      qty: String(productionProcesses.qty ?? ""),
      notes: productionProcesses.notes ?? "",
      status: productionProcesses.status ?? "",
    });
  }, [productionProcesses, form, productionProcessId]);
  return (
    <div className="w-full">
      <CardFormProductionProcess
        form={form}
        type="Detail"
        isLoading={isLoadingProductionProcesses}
      />
    </div>
  );
}

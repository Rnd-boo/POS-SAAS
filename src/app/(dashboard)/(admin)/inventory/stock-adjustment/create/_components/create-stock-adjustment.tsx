"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useQueryClient } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  StockAdjustmentForm,
  stockAdjustmentFormSchema,
} from "@/validations/inventory/stock-adjustment.validation";
import CardFormStockAdjusment from "../../_components/card-form-stock-adjustment";
import { INITIAL_STOCK_ADJUSTMENT } from "@/constants/inventory/stock-adjustment.constant";

export default function CreateStockAdjusment() {
  const queryClient = useQueryClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<StockAdjustmentForm>({
    resolver: zodResolver(stockAdjustmentFormSchema),
    defaultValues: INITIAL_STOCK_ADJUSTMENT,
  });
  //   const [
  //     createProductionOrderState,
  //     createProductionOrderAction,
  //     isPendingcreateProductionOrder,
  //   ] = useActionState(createProductionOrder, INITIAL_STATE_PRODUCTION_ORDER);

  //   const onSubmit = form.handleSubmit(async (data) => {
  //     const formData = new FormData();
  //     Object.entries(data).forEach(([key, value]) => {
  //       formData.append(key, String(value));
  //       formData.append("brand_id", String(currentBrandId));
  //     });
  //     startTransition(() => {
  //       createProductionOrderAction(formData);
  //     });
  //   });
  //   useEffect(() => {
  //     if (createProductionOrderState?.status === "error") {
  //       toast.error("Create Production Order Failed", {
  //         description: createProductionOrderState.errors?._form?.[0],
  //       });
  //     }
  //     if (createProductionOrderState?.status === "success") {
  //       toast.success("Create Production Order Success");
  //       form.reset();
  //       queryClient.refetchQueries({ queryKey: ["production_orders"] });
  //       router.push("/production/orders");
  //     }
  //   }, [createProductionOrderState]);

  return (
    <div className="w-full">
      <CardFormStockAdjusment form={form} type="Create" />
    </div>
  );
}

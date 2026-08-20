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
import {
  INITIAL_STATE_STOCK_ADJUSTMENT,
  INITIAL_STOCK_ADJUSTMENT,
} from "@/constants/inventory/stock-adjustment.constant";
import { createStockAdjustment } from "../../action";

export default function CreateStockAdjusment() {
  const queryClient = useQueryClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const router = useRouter();
  const form = useForm<StockAdjustmentForm>({
    resolver: zodResolver(stockAdjustmentFormSchema),
    defaultValues: INITIAL_STOCK_ADJUSTMENT,
  });
  const [
    createStockAdjustmentState,
    createStockAdjustmentAction,
    isPendingcreateStockAdjustment,
  ] = useActionState(createStockAdjustment, INITIAL_STATE_STOCK_ADJUSTMENT);

  const onSubmit = form.handleSubmit(
    async (data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "stock_adjustment_items") {
          formData.append("stock_adjustment_items", JSON.stringify(value));
        } else {
          formData.append(key, String(value ?? ""));
        }
        formData.append("brand_id", String(currentBrandId));
      });
      startTransition(() => {
        createStockAdjustmentAction(formData);
      });
    },
    (errors) => {
      console.log(errors);
    },
  );
  useEffect(() => {
    if (createStockAdjustmentState?.status === "error") {
      toast.error("Create Stock Adjustment Failed", {
        description: createStockAdjustmentState.errors?._form?.[0],
      });
    }
    if (createStockAdjustmentState?.status === "success") {
      toast.success("Create Stock Adjustment Success");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["stock_adjustments"] });
      router.push("/inventory/stock-adjustment");
    }
  }, [createStockAdjustmentState]);

  return (
    <div className="w-full">
      <CardFormStockAdjusment
        form={form}
        type="Create"
        onSubmit={onSubmit}
        isPending={isPendingcreateStockAdjustment}
      />
    </div>
  );
}

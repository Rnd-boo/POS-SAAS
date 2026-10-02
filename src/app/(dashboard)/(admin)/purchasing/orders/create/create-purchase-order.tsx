"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useQueryClient } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import CardFormPurchaseOrder from "../_components/card-form-purchase-order";
import {
  PurchaseOrderForm,
  purchaseOrderFormSchema,
} from "@/validations/purchasing/purchase-order.validation";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import { INITIAL_PURCHASE_ORDER } from "@/constants/purchasing/purchase-order.constant";

export default function CreatePurchaseOrder() {
  const queryClient = useQueryClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const router = useRouter();
  const form = useForm<PurchaseOrderForm>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: INITIAL_PURCHASE_ORDER,
  });
  const { data: branches, isLoading: isLoadingBranch } = useBranchQuery();
  //   const [
  //     createStockAdjustmentState,
  //     createStockAdjustmentAction,
  //     isPendingcreateStockAdjustment,
  //   ] = useActionState(createStockAdjustment, INITIAL_STATE_STOCK_ADJUSTMENT);

  //   const onSubmit = form.handleSubmit(async (data) => {
  //     const formData = new FormData();
  //     Object.entries(data).forEach(([key, value]) => {
  //       if (key === "stock_adjustment_items") {
  //         formData.append("stock_adjustment_items", JSON.stringify(value));
  //       } else {
  //         formData.append(key, String(value ?? ""));
  //       }
  //       formData.append("brand_id", String(currentBrandId));
  //     });
  //     startTransition(() => {
  //       createStockAdjustmentAction(formData);
  //     });
  //   });
  //   useEffect(() => {
  //     if (createStockAdjustmentState?.status === "error") {
  //       toast.error("Create Stock Adjustment Failed", {
  //         description: createStockAdjustmentState.errors?._form?.[0],
  //       });
  //     }
  //     if (createStockAdjustmentState?.status === "success") {
  //       toast.success("Create Stock Adjustment Success");
  //       form.reset();
  //       queryClient.refetchQueries({ queryKey: ["stock_adjustments"] });
  //       router.push("/inventory/stock-adjustment");
  //     }
  //   }, [createStockAdjustmentState]);

  return (
    <div className="w-full">
      <CardFormPurchaseOrder
        form={form}
        type="Create"
        branches={branches ?? []}
      />
    </div>
  );
}

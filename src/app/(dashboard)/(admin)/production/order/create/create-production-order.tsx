"use client";

import CardFormProductionOrder from "../_components/card-form-production-order";
import { useForm } from "react-hook-form";
import {
  ProductionOrderForm,
  productionOrderFormSchema,
} from "@/validations/production/production-order.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  INITIAL_PRODUCTION_ORDER,
  INITIAL_STATE_PRODUCTION_ORDER,
} from "@/constants/production/production-order.constant";
import { useQueryClient } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { createProductionOrder } from "../action";
import { toast } from "sonner";

export default function CreateProductionOrder() {
  const queryClient = useQueryClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const router = useRouter();

  const form = useForm<ProductionOrderForm>({
    resolver: zodResolver(productionOrderFormSchema),
    defaultValues: INITIAL_PRODUCTION_ORDER,
  });
  const [
    createProductionOrderState,
    createProductionOrderAction,
    isPendingcreateProductionOrder,
  ] = useActionState(createProductionOrder, INITIAL_STATE_PRODUCTION_ORDER);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
      formData.append("brand_id", String(currentBrandId));
    });
    startTransition(() => {
      createProductionOrderAction(formData);
    });
  });
  useEffect(() => {
    if (createProductionOrderState?.status === "error") {
      toast.error("Create Production Order Failed", {
        description: createProductionOrderState.errors?._form?.[0],
      });
    }
    if (createProductionOrderState?.status === "success") {
      toast.success("Create Production Order Success");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["production_order"] });
      router.push("/production/order");
    }
  }, [createProductionOrderState]);

  return (
    <div className="w-full">
      <CardFormProductionOrder
        form={form}
        type="Create"
        onSubmit={onSubmit}
        isPending={isPendingcreateProductionOrder}
      />
    </div>
  );
}

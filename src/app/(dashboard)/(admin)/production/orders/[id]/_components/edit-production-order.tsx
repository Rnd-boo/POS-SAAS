"use client";

import { useForm } from "react-hook-form";
import CardFormProductionOrder from "../../_components/card-form-production-order";
import {
  ProductionOrderForm,
  productionOrderFormSchema,
} from "@/validations/production/production-order.validation";
import {
  INITIAL_PRODUCTION_ORDER,
  INITIAL_STATE_PRODUCTION_ORDER,
} from "@/constants/production/production-order.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { toast } from "sonner";
import { startTransition, useActionState, useEffect } from "react";
import { updateProductionOrder } from "../../action";

export default function EditProductionOrder() {
  const params = useParams();
  const productionOrderId = params.id;
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<ProductionOrderForm>({
    resolver: zodResolver(productionOrderFormSchema),
    defaultValues: INITIAL_PRODUCTION_ORDER,
  });

  const [
    updateProductionOrderState,
    updateProductionOrderAction,
    isPendingUpdateProductionOrder,
  ] = useActionState(updateProductionOrder, INITIAL_STATE_PRODUCTION_ORDER);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formData.append("id", String(productionOrderId));
    startTransition(() => {
      updateProductionOrderAction(formData);
    });
  });

  const { data: productionOrders, isLoading: isLoadingproductionOrders } =
    useQuery({
      queryKey: ["production_orders", productionOrderId],

      queryFn: async () => {
        const result = await supabase
          .from("production_orders")
          .select(
            `id, production_order_date,branch_id, branch(id,name), notes,status,type, qty, bill_of_materials_id,brand_id`,
            { count: "exact" },
          )
          .eq("clients_id", currentId)
          .eq("brand_id", currentBrandId)
          .eq("id", productionOrderId)
          .single();

        if (result.error)
          toast.error("Get Production Orders Data Failed", {
            description: result.error.message,
          });

        return result.data;
      },
      enabled: !!currentId && !!productionOrderId,
    });

  useEffect(() => {
    form.setValue("branch_id", String(productionOrders?.branch_id));
    form.setValue(
      "production_order_date",
      productionOrders?.production_order_date,
    );
    form.setValue("type", productionOrders?.type);
    form.setValue(
      "bill_of_materials_id",
      productionOrders?.bill_of_materials_id
        ? String(productionOrders.bill_of_materials_id)
        : "",
    );
    form.setValue("qty", String(productionOrders?.qty));
    form.setValue("notes", productionOrders?.notes);
    form.setValue("status", productionOrders?.status);
  }, [productionOrders, form]);

  useEffect(() => {
    if (updateProductionOrderState?.status === "error") {
      toast.error("Create Production Order Failed", {
        description: updateProductionOrderState.errors?._form?.[0],
      });
    }
    if (updateProductionOrderState?.status === "success") {
      toast.success("Create Production Order Success");
      queryClient.refetchQueries({ queryKey: ["production_orders"] });
      router.push("/production/orders");
    }
  }, [updateProductionOrderState]);

  return (
    <CardFormProductionOrder
      type="Update"
      form={form}
      onSubmit={onSubmit}
      isPending={isPendingUpdateProductionOrder}
      isLoading={isLoadingproductionOrders}
    />
  );
}

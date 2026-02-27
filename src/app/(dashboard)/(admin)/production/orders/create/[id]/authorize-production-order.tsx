"use client";

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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import CardFormProductionOrder from "../../_components/card-form-production-order";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { authorizeProductionOrder, rejectProductionOrder } from "../../action";

export default function AuthorizeProductionOrder() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const params = useParams();
  const router = useRouter();
  const productionOrderId = params?.id as string;
  const form = useForm<ProductionOrderForm>({
    resolver: zodResolver(productionOrderFormSchema),
    defaultValues: INITIAL_PRODUCTION_ORDER,
  });
  const [
    authorizeProductionOrderState,
    authorizeProductionOrderAction,
    isPendingauthorizeProductionOrder,
  ] = useActionState(authorizeProductionOrder, INITIAL_STATE_PRODUCTION_ORDER);

  const [rejectState, rejectAction] = useActionState(
    rejectProductionOrder,
    INITIAL_STATE_PRODUCTION_ORDER,
  );

  const onSubmit = form.handleSubmit(async () => {
    const formData = new FormData();
    formData.append("id", String(productionOrderId));
    startTransition(() => {
      authorizeProductionOrderAction(formData);
    });
  });

  const handleReject = () => {
    const formData = new FormData();
    formData.append("id", String(productionOrderId));

    startTransition(() => {
      rejectAction(formData);
    });
  };
  const {
    data: productionOrders,
    isLoading: isLoadingproductionOrders,
    refetch,
  } = useQuery({
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
  }, [productionOrders, form]);

  useEffect(() => {
    if (authorizeProductionOrderState?.status === "error") {
      toast.error("Create Production Order Failed", {
        description: authorizeProductionOrderState.errors?._form?.[0],
      });
    }
    if (authorizeProductionOrderState?.status === "success") {
      toast.success("Create Production Order Success");
      queryClient.refetchQueries({ queryKey: ["production_orders"] });
      router.push("/production/orders");
    }
  }, [authorizeProductionOrderState]);

  useEffect(() => {
    if (rejectState?.status === "error") {
      toast.error("Reject Production Order Failed", {
        description: rejectState.errors?._form?.[0],
      });
    }
    if (rejectState?.status === "success") {
      toast.success("Reject Production Order Success");
      queryClient.refetchQueries({ queryKey: ["production_orders"] });
      router.push("/production/orders");
    }
  }, [rejectState]);

  return (
    <div className="w-full">
      <CardFormProductionOrder
        form={form}
        type="Authorize"
        onSubmit={onSubmit}
        isPending={isPendingauthorizeProductionOrder}
        handleReject={handleReject}
      />
    </div>
  );
}

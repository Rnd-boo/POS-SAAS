"use client";

import { INITIAL_PRODUCTION_ORDER } from "@/constants/production/production-order.constant";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import {
  ProductionOrderForm,
  productionOrderFormSchema,
} from "@/validations/production/production-order.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CardFormProductionOrder from "../../_components/card-form-production-order";

export default function DetailProductionOrder() {
  const params = useParams();
  const productionOrderId = params?.id as string;
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);

  const form = useForm<ProductionOrderForm>({
    resolver: zodResolver(productionOrderFormSchema),
    defaultValues: INITIAL_PRODUCTION_ORDER,
  });

  const { data: productionOrders, isLoading: isLoadingproductionOrders } =
    useQuery({
      queryKey: ["production_order_detail", productionOrderId],

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

  console.log(productionOrders);
  return (
    <div className="w-full">
      <CardFormProductionOrder
        form={form}
        type="Detail"
        isLoading={isLoadingproductionOrders}
      />
    </div>
  );
}

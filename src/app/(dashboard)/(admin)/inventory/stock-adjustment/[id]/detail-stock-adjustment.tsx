"use client";

import { createClient } from "@/lib/supabase/client";
import { INITIAL_STOCK_ADJUSTMENT } from "@/constants/inventory/stock-adjustment.constant";
import {
  StockAdjustmentForm,
  stockAdjustmentFormSchema,
} from "@/validations/inventory/stock-adjustment.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Product } from "@/validations/products/product-validation";
import { Unit } from "@/validations/products/unit-validation";
import CardFormStockAdjusment from "../_components/card-form-stock-adjustment";

export default function DetailStockAdjustment() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const params = useParams();
  const router = useRouter();
  const stockAdjustmentId = params?.id as string;
  const form = useForm<StockAdjustmentForm>({
    resolver: zodResolver(stockAdjustmentFormSchema),
    defaultValues: INITIAL_STOCK_ADJUSTMENT,
  });

  const { data: stockAdjustment, isLoading: isLoadingStockAdjustment } =
    useQuery({
      queryKey: ["stock_adjustments", stockAdjustmentId],

      queryFn: async () => {
        const result = await supabase
          .from("stock_adjustments")
          .select(
            `stock_adjustment_date, branch_id, branch_location_id, notes,status, reason`,
            { count: "exact" },
          )
          .eq("clients_id", currentId)
          .eq("brand_id", currentBrandId)
          .eq("id", stockAdjustmentId)
          .single();

        if (result.error)
          toast.error("Get Stock Adjustment Data Failed", {
            description: result.error.message,
          });

        return result.data;
      },
      enabled: !!currentId && !!stockAdjustmentId,
    });

  useEffect(() => {
    form.setValue("branch_id", String(stockAdjustment?.branch_id));
    form.setValue(
      "stock_adjustment_date",
      stockAdjustment?.stock_adjustment_date,
    );
    form.setValue("reason", stockAdjustment?.reason);
    form.setValue(
      "branch_location_id",
      String(stockAdjustment?.branch_location_id),
    );
    form.setValue("notes", stockAdjustment?.notes);
    form.setValue("status", stockAdjustment?.status);
  }, [stockAdjustment, form]);

  const {
    data: stockAdjustmentItems,
    isLoading: isLoadingStockAdjustmentItems,
  } = useQuery({
    queryKey: ["stock_adjustment_items", stockAdjustmentId],

    queryFn: async () => {
      const result = await supabase
        .from("stock_adjustment_items")
        .select(
          `product_units_id, current_qty, product_name,
            product_units (
            products(id,name,upc),
            units(name)
          )`,
        )
        .eq("clients_id", currentId)
        .eq("stock_adjustments_id", stockAdjustmentId);

      if (result.error)
        toast.error("Get Stock Adjustment Items Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!stockAdjustmentId,
  });

  useEffect(() => {
    if (!stockAdjustmentItems) return;
    const items = stockAdjustmentItems.map((item) => ({
      product_name: item.product_name,
      product_upc: (item.product_units as { products?: Product })?.products
        ?.upc,
      current_qty: item.current_qty,
      products_id: (item.product_units as unknown as { products: Product })
        ?.products?.id,
      product_units_id: String(item.product_units_id),
      unit_name: (item.product_units as { units?: Unit })?.units?.name,
    }));

    form.setValue("stock_adjustment_items", items);
  }, [stockAdjustmentItems, form]);

  return (
    <CardFormStockAdjusment
      isLoading={isLoadingStockAdjustment && isLoadingStockAdjustmentItems}
      form={form}
      type="Detail"
    />
  );
}

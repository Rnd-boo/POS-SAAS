"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { ProductionProcessForm } from "@/validations/production/production-process.validation";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export default function FormProductionMaterial({
  form,
  type,
  isLoading,
}: {
  form: UseFormReturn<ProductionProcessForm>;
  type: "Create" | "Update" | "Detail" | "Authorize";
  isLoading?: boolean;
}) {
  const productionOrderId = form.watch("production_orders_id");
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);

  const { data: productionOrders } = useQuery({
    queryKey: ["production_orders", productionOrderId],
    queryFn: async () => {
      const result = await supabase
        .from("production_orders")
        .select(`id, bill_of_materials_id ,qty`)
        .eq("clients_id", currentId)
        .eq("id", productionOrderId);

      if (result.error)
        toast.error("Get Production Orders Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!productionOrderId,
  });

  const billOfMaterialId = productionOrders?.[0]?.bill_of_materials_id;
  const productionOrderQty = productionOrders?.[0]?.qty;
  const qty = form.watch("qty");
  const branchLocationId = form.watch("branch_location_id");

  const {
    data: productBillOfMaterials,
    isLoading: isLoadingProductBillOfMaterials,
  } = useQuery({
    queryKey: ["productBillOfMaterials", billOfMaterialId],
    queryFn: async () => {
      const result = await supabase
        .from("product_bill_of_materials")
        .select(
          `id, qty, waste, bill_of_materials(id),
              product_units (
                products_id,units_id, conversion_factor,
                products(name,upc), 
                units (name)
                )`,
        )
        .eq("clients_id", currentId)
        .eq("bill_of_materials_id", billOfMaterialId);

      if (result.error)
        toast.error("Get Product Bill Of Materials Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!billOfMaterialId,
  });
  const productStockId =
    productBillOfMaterials?.map(
      (item) => (item.product_units as { products_id?: string })?.products_id,
    ) ?? [];

  const { data: productStocks, isLoading: isLoadingProductStocks } = useQuery({
    queryKey: ["product_stocks", productStockId, branchLocationId],
    queryFn: async () => {
      const result = await supabase
        .from("product_stocks")
        .select(`id, products_id, stock_qty`)
        .eq("clients_id", currentId)
        .in("products_id", productStockId)
        .eq("branch_location_id", branchLocationId);

      if (result.error)
        toast.error("Get Product Stocks Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!productStockId && !!branchLocationId,
  });

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2">
      <Label>Product Name</Label>
      <Label>Product Code</Label>
      <Label>Unit</Label>
      <Label>Stock</Label>
      <Label>Required QTY</Label>
      <Label>QTY</Label>
      {productBillOfMaterials?.map((products) => {
        const OrderQTY =
          (products?.qty + products?.waste) * Number(productionOrderQty);

        const totalQTY = Number(qty) * (products?.qty + products?.waste);
        const productId = (products?.product_units as { products_id?: string })
          ?.products_id;
        const stock = productStocks?.find((s) => s.products_id === productId);
        return (
          <Fragment key={products.id}>
            <Input
              value={
                (products?.product_units as { products?: { name: string } })
                  ?.products?.name ?? ""
              }
              disabled
            />
            <Input
              value={
                (products?.product_units as { products?: { upc: string } })
                  ?.products?.upc ?? ""
              }
              disabled
            />
            <Input
              value={
                (products?.product_units as { units?: { name: string } })?.units
                  ?.name ?? ""
              }
              disabled
            />
            <Input value={stock?.stock_qty ?? ""} disabled />
            <Input value={OrderQTY ?? ""} disabled />
            <Input value={totalQTY ?? ""} disabled />
          </Fragment>
        );
      })}
    </div>
  );
}

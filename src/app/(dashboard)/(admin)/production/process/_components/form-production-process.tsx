"use client";

import FormDatePicker from "@/components/common/form-date-picker";
import FormInput from "@/components/common/form-input";
import FormSelectData from "@/components/common/form-select-data";
import { Combobox } from "@/components/common/manual-combobox";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { UnitProduct } from "@/types/products/product-dialog";
import { ProductionProcessForm } from "@/validations/production/production-process.validation";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export default function FormProductionOrderBOM({
  form,
  type,
  isLoading,
}: {
  form: UseFormReturn<ProductionProcessForm>;
  type: "Create" | "Update" | "Detail" | "Authorize";
  isLoading?: boolean;
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const { data: branches } = useBranchQuery();

  const branchId = form.watch("branch_id");
  const productionOrderId = form.watch("production_orders_id");
  const { data: branchLocations, isLoading: isLoadingBranchLocation } =
    useQuery({
      queryKey: ["branch_location", branchId],
      queryFn: async () => {
        const result = await supabase
          .from("branch_location")
          .select(`id,name`)
          .eq("clients_id", currentId)
          .eq("branch_id", branchId);

        if (result.error)
          toast.error("Get Location Data Failed", {
            description: result.error.message,
          });

        return result.data;
      },
      enabled: !!currentId && !!branchId && branchId !== "undefined",
    });

  const { data: productionOrders, isLoading: isLoadingProductionOrders } =
    useQuery({
      queryKey: ["production_orders", branchId],
      queryFn: async () => {
        const result = await supabase
          .from("production_orders")
          .select(
            `id, bill_of_materials_id,type, qty,
            bill_of_materials(name,
            product_units(
                products(name,upc),
                units(name)
            ))`,
          )
          .eq("clients_id", currentId)
          .eq("branch_id", branchId)
          .eq("status", "authorized");

        if (result.error)
          toast.error("Get Production Orders Data Failed", {
            description: result.error.message,
          });

        return result.data;
      },
      enabled: !!currentId && !!branchId && branchId !== "undefined",
    });

  const { data: productionProcess } = useQuery({
    queryKey: ["production_process", productionOrderId],
    queryFn: async () => {
      const result = await supabase
        .from("production_order_summary")
        .select("*")
        .eq("id", productionOrderId)
        .single();

      return result.data;
    },
    enabled: !!currentId && !!productionOrderId,
  });

  const selectedProductionOrders = productionOrders?.find(
    (s) => s.id === productionOrderId,
  );
  const handleGetOutstanding = () => {
    form.setValue("qty", String(productionProcess.outstanding_qty) ?? "");
  };

  return (
    <div className="grid grid-cols-[2fr_3fr_2fr] gap-4">
      <FormField
        control={form.control}
        name="branch_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Branch <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              {isLoading ? (
                <Skeleton className="h-9" />
              ) : (
                <Combobox
                  disabled={type === "Authorize" || type === "Detail"}
                  placeholder="Select Branch"
                  modal
                  items={
                    branches?.map((branch) => ({
                      label: branch.name,
                      value: String(branch.id),
                    })) || []
                  }
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    form.setValue("production_orders_id", "");
                    form.setValue("branch_location_id", "");
                    form.setValue("qty", "");
                  }}
                />
              )}
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormDatePicker
        isLoading={isLoading}
        disabled={type === "Authorize" || type === "Detail"}
        required
        form={form}
        label="Production Process Date"
        name="production_process_date"
      />
      <FormSelectData
        isLoading={isLoadingBranchLocation}
        form={form}
        name="branch_location_id"
        data={branchLocations || []}
        label="Location"
        required
        disabled={type === "Authorize" || type === "Detail"}
      />
      <FormSelectData
        isLoading={isLoadingProductionOrders}
        form={form}
        name="production_orders_id"
        data={productionOrders || []}
        labelKey="id"
        label="Production Order"
        required
        disabled={type === "Authorize" || type === "Detail"}
      />
      <div>
        <Label className="mb-2">Bill Of Material Name</Label>
        <Input
          value={
            (selectedProductionOrders?.bill_of_materials as { name?: string })
              ?.name ?? ""
          }
          disabled
          placeholder="Select Production Order"
        />
      </div>
      <div>
        <Label className="mb-2">Bill Of Material Type</Label>
        <Input
          value={selectedProductionOrders?.type ?? ""}
          disabled
          className="capitalize"
          placeholder="Select Production Order"
        />
      </div>
      <Separator className="col-span-full" />
      <div className="col-span-full">
        <div className="flex justify-between">
          <h2 className="font-semibold">Production Result Detail</h2>
          {type !== "Detail" && type !== "Authorize" && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleGetOutstanding}
              type="button"
            >
              Get Outstanding Qty
            </Button>
          )}
        </div>
        {isLoadingProductionOrders || isLoading ? (
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] mt-4 gap-2">
            <Skeleton className="h-2" />
            <Skeleton className="h-2" />
            <Skeleton className="h-2" />
            <Skeleton className="h-2" />
            <Skeleton className="h-2" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
          </div>
        ) : (
          productionOrderId && (
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] mt-4 gap-2">
              <Label>Product Name</Label>
              <Label>Product Code</Label>
              <Label>Unit</Label>
              <Label>Production Order QTY</Label>
              <Label>QTY</Label>
              <Input
                value={
                  (
                    selectedProductionOrders?.bill_of_materials as {
                      product_units?: UnitProduct;
                    }
                  )?.product_units?.products.name ?? ""
                }
                disabled
              />
              <Input
                value={
                  (
                    selectedProductionOrders?.bill_of_materials as {
                      product_units?: UnitProduct;
                    }
                  )?.product_units?.products.upc ?? ""
                }
                disabled
              />
              <Input
                value={
                  (
                    selectedProductionOrders?.bill_of_materials as {
                      product_units?: UnitProduct;
                    }
                  )?.product_units?.units.name ?? ""
                }
                disabled
              />
              <Input value={selectedProductionOrders?.qty ?? ""} disabled />
              <FormField
                control={form.control}
                name="qty"
                render={({ field: { ...rest } }) => (
                  <FormItem>
                    <FormControl>
                      {isLoading ? (
                        <Skeleton className="h-9" />
                      ) : (
                        <Input
                          {...rest}
                          type="number"
                          autoComplete="off"
                          disabled={type === "Detail"}
                          placeholder="Insert QTY"
                          onChange={(e) => {
                            rest.onChange(e);
                          }}
                        />
                      )}
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}

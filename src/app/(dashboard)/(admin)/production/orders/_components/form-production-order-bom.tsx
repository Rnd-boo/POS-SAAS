"use client";

import DialogBillOfMaterials from "@/components/common/dialog-bill-of-materials";
import FormInput from "@/components/common/form-input";
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
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { UnitProduct } from "@/types/products/product-dialog";
import { ProductionOrderForm } from "@/validations/production/production-order.validation";
import { BillOfMaterials } from "@/validations/products/bill-of-materials-validation";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export default function FormProductionOrderBOM({
  form,
  type,
  isLoading,
}: {
  form: UseFormReturn<ProductionOrderForm>;
  type: "Detail" | "Create" | "Update" | "Authorize";
  isLoading?: boolean;
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const [open, setOpen] = useState(false);

  const [selectedBOM, setSelectedBOM] = useState<
    Record<string, BillOfMaterials | null>
  >({});
  const viewBOMId = form.watch("bill_of_materials_id");

  const billOfMaterialsId = selectedBOM?.bill_of_materials?.id ?? viewBOMId;

  const { data: billOfMaterials } = useQuery({
    queryKey: ["bill_of_materials", viewBOMId],
    queryFn: async () => {
      const result = await supabase
        .from("bill_of_materials")
        .select(
          `name,code, product_units (
                products!inner (name),
                units!inner (name)
                )`,
        )
        .eq("clients_id", currentId)
        .eq("id", viewBOMId)
        .single();

      if (result.error)
        toast.error("Get Product Bill Of Materials Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!viewBOMId,
  });

  const {
    data: productBillOfMaterials,
    isLoading: isLoadingProductBillOfMaterials,
  } = useQuery({
    queryKey: ["productBillOfMaterials", billOfMaterialsId],
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
        .eq("bill_of_materials_id", billOfMaterialsId);

      if (result.error)
        toast.error("Get Product Bill Of Materials Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!billOfMaterialsId,
  });

  return (
    <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4">
      <FormField
        control={form.control}
        name="bill_of_materials_id"
        render={() => (
          <FormItem>
            <FormLabel>
              Bill Of Material <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  disabled={type === "Authorize" || type === "Detail"}
                  placeholder="Select Bill Of Material"
                  value={
                    selectedBOM?.bill_of_materials?.name ??
                    billOfMaterials?.name ??
                    ""
                  }
                  onClick={() => setOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setOpen(true);
                    }
                  }}
                  onChange={() => setOpen(true)}
                />
              )}
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <div>
        <Label className="mb-2">Product</Label>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Input
            disabled
            value={
              (
                selectedBOM?.bill_of_materials as {
                  product_units?: UnitProduct;
                }
              )?.product_units?.products?.name ??
              (
                billOfMaterials?.product_units as {
                  products?: { name: string };
                }
              )?.products?.name ??
              ""
            }
          />
        )}
      </div>
      <div>
        <Label className="mb-2">Unit</Label>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Input
            disabled
            value={
              (
                selectedBOM?.bill_of_materials as {
                  product_units?: UnitProduct;
                }
              )?.product_units?.units?.name ??
              (billOfMaterials?.product_units as { units?: { name: string } })
                ?.units?.name ??
              ""
            }
          />
        )}
      </div>
      <FormInput
        isLoading={isLoading}
        disabled={type === "Authorize" || type === "Detail"}
        form={form}
        name="qty"
        label="QTY"
        required
        placeholder="Insert QTY"
      />
      <DialogBillOfMaterials
        type={form.getValues("type")}
        setSelectedBOM={setSelectedBOM}
        open={open}
        onOpenChange={setOpen}
        form={form}
      />
      <Separator className="col-span-full" />
      <div className="col-span-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2">
        {billOfMaterialsId && (
          <>
            <Label>Product Name</Label>
            <Label>UPC</Label>
            <Label>Unit</Label>
            <div>
              <Label>Bill Of Material QTY</Label>
            </div>
            <Label>Total QTY</Label>
          </>
        )}
        {isLoadingProductBillOfMaterials || isLoading ? (
          <>
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
          </>
        ) : (
          productBillOfMaterials?.map((productBOM) => {
            const billOfMaterialQTY = productBOM.qty + productBOM.waste;
            const totalQTY = Number(form.watch("qty")) * billOfMaterialQTY;
            const result = Math.round(totalQTY * 1000) / 1000;

            return (
              <Fragment key={productBOM.id}>
                <Input
                  value={
                    (
                      productBOM?.product_units as {
                        products?: { name: string };
                      }
                    )?.products?.name ?? ""
                  }
                  disabled
                />
                <Input
                  value={
                    (
                      productBOM?.product_units as {
                        products?: { upc: string };
                      }
                    )?.products?.upc ?? ""
                  }
                  disabled
                />
                <Input
                  value={
                    (productBOM?.product_units as { units?: { name: string } })
                      ?.units?.name ?? ""
                  }
                  disabled
                />
                <Input value={billOfMaterialQTY ?? ""} disabled />
                <Input value={result ?? ""} disabled />
              </Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}

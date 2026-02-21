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
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { UnitProduct } from "@/types/products/product-dialog";
import { ProductionOrderForm } from "@/validations/production/production-order.validation";
import { BillOfMaterials } from "@/validations/products/bill-of-materials-validation";
import { Product } from "@/validations/products/product-validation";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export default function FormProductionOrderBOM({
  form,
  type,
}: {
  form: UseFormReturn<ProductionOrderForm>;
  type: "Detail" | "Create" | "Update";
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const [open, setOpen] = useState(false);

  const [selectedBOM, setSelectedBOM] = useState<
    Record<string, BillOfMaterials | null>
  >({});
  const billOfMaterialsId = selectedBOM?.bill_of_materials?.id;
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
                id,products_id,units_id,
                products(name), 
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
              <Input
                placeholder="Select Bill Of Material"
                value={selectedBOM?.bill_of_materials?.name ?? ""}
                onClick={() => setOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setOpen(true);
                  }
                }}
                onChange={() => setOpen(true)}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <div>
        <Label className="mb-2">Product</Label>
        <Input
          value={
            (
              selectedBOM?.bill_of_materials as {
                product_units?: UnitProduct;
              }
            )?.product_units?.products?.name ?? ""
          }
          readOnly
        />
      </div>
      <div>
        <Label className="mb-2">Unit</Label>
        <Input
          value={
            (
              selectedBOM?.bill_of_materials as {
                product_units?: UnitProduct;
              }
            )?.product_units?.units?.name ?? ""
          }
          readOnly
        />
      </div>
      <FormInput
        form={form}
        name="qty"
        label="QTY"
        required
        placeholder="Insert QTY"
      />
      <DialogBillOfMaterials
        setSelectedBOM={setSelectedBOM}
        open={open}
        onOpenChange={setOpen}
        form={form}
      />
      <Separator className="col-span-full" />
      <div className="col-span-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2">
        <Label>Product Name</Label>
        <Label>Product Unit</Label>
        <Label>Stock</Label>
        <div>
          <Label>Bill Of Material QTY</Label>
        </div>
        <Label>Total QTY</Label>
        {productBillOfMaterials?.map((productBOM) => {
          const billOfMaterialQTY = productBOM.qty + productBOM.waste;
          const totalQTY = Number(form.watch("qty")) * billOfMaterialQTY;
          const result = Math.round(totalQTY * 1000) / 1000;
          return (
            <Fragment key={productBOM.id}>
              <Input
                value={
                  (productBOM?.product_units as { products?: { name: string } })
                    ?.products?.name ?? ""
                }
                readOnly
              />
              <Input
                value={
                  (productBOM?.product_units as { units?: { name: string } })
                    ?.units?.name ?? ""
                }
                readOnly
              />
              <Input value={productBOM?.qty ?? ""} readOnly />
              <Input value={billOfMaterialQTY ?? ""} readOnly />
              <Input value={result ?? ""} readOnly />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

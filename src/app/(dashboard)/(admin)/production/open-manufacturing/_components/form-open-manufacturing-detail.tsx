"use client";

import DialogBillOfMaterials from "@/components/common/dialog-bill-of-materials";
import DialogProducts from "@/components/common/dialog-products";
import FormInput from "@/components/common/form-input";
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
import { DisplayName } from "@/constants/products/bill-of-materials.constant";
import { useProductStockQuery } from "@/hooks/queries/use-product-stocks";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { UnitProduct } from "@/types/products/product-dialog";
import { OpenManufacturingForm } from "@/validations/production/open-manufacturing.validation";
import { BillOfMaterials } from "@/validations/products/bill-of-materials-validation";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export default function FormOpenManufacturinDetail({
  form,
  type,
  isLoading,
  displayNames,
}: {
  form: UseFormReturn<OpenManufacturingForm>;
  type: "Detail" | "Create" | "Update";
  isLoading?: boolean;
  displayNames?: Record<string, DisplayName | DisplayName[]>;
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [activeMapping, setActiveMapping] = useState<Record<string, string>>(
    {},
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<
    Record<string, UnitProduct | null>
  >({});

  const [selectedBOM, setSelectedBOM] = useState<
    Record<string, BillOfMaterials | null>
  >({});

  const billOfMaterialsId = selectedBOM?.bill_of_materials?.id;
  const { data: billOfMaterials } = useQuery({
    queryKey: ["bill_of_materials"],
    queryFn: async () => {
      const result = await supabase
        .from("bill_of_materials")
        .select(
          `name,code, product_units (
                products!inner (name),
                units!inner (name)
                )`,
        )
        .eq("clients_id", currentId);
      if (result.error)
        toast.error("Get Product Bill Of Materials Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId,
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
          `id, qty, waste, bill_of_materials(id), product_units_id,
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

  const { fields, append, remove, replace, update } = useFieldArray({
    control: form.control,
    name: "products_detail",
  });

  const productsDetail = form.watch("products_detail");
  const canAddMaterial =
    !productsDetail?.length ||
    Boolean(productsDetail[productsDetail.length - 1]?.product_name);

  const handleAddMaterial = () => {
    if (!canAddMaterial) {
      toast.error(
        "Please select a product for the last material before adding another.",
      );
      return;
    }

    append({
      product_units_id: "",
      qty: "",
      on_hand: 0,
      product_name: "",
      product_upc: "",
      unit_name: "",
      bill_of_material_qty: "",
    });
  };

  const [displayProductName, setDisplayProductName] = useState<
    string | undefined
  >(
    (displayNames?.bill_of_materials as { productName?: string } | undefined)
      ?.productName,
  );

  const [displayUnitName, setDisplayUnitName] = useState<string | undefined>(
    (displayNames?.bill_of_materials as { unitName?: string } | undefined)
      ?.unitName,
  );

  useEffect(() => {
    const selected = selectedBOM["bill_of_materials"];
    const productName = (selected as { product_units?: UnitProduct })
      ?.product_units?.products?.name;

    const productId = selected?.product_units_id;
    form.setValue("product_name", productName ?? "");
    form.setValue("product_units_id", String(productId) ?? "");
    if (productName) {
      setDisplayProductName(productName);
      setDisplayUnitName(
        (
          selectedBOM?.bill_of_materials as {
            product_units?: UnitProduct;
          }
        )?.product_units?.units?.name,
      );
    }
  }, [selectedBOM, displayNames]);

  useEffect(() => {
    const selected = selectedProduct["products"];
    if (!selected) return;

    form.setValue("product_units_id", String(selected.id ?? ""));
    form.setValue("product_name", selected.products?.name ?? "");

    if (selected.products?.name) {
      setDisplayProductName(selected.products.name);
      setDisplayUnitName(selected.units.name);
    }
  }, [selectedProduct["products"], form]);

  const productStockIds = productBillOfMaterials
    ?.map(
      (productBOM) =>
        (productBOM.product_units as { products_id?: string })?.products_id,
    )
    .filter(Boolean) as string[];

  const { productStock } = useProductStockQuery({
    branch_location_id: form.watch("origin_branch_location_id") ?? "",
    productIds: productStockIds,
  });

  useEffect(() => {
    if (!productBillOfMaterials || productBillOfMaterials.length === 0) return;

    replace(
      productBillOfMaterials.map((productBOM) => ({
        product_units_id: String(productBOM.product_units_id ?? ""),
        qty: String(productBOM.qty),
        on_hand:
          productStock?.data?.find(
            (stockRow) =>
              stockRow.products_id ===
              (productBOM.product_units as { products_id?: string })
                ?.products_id,
          )?.on_hand ?? 0,
        product_name:
          (productBOM.product_units as { products?: { name: string } })
            ?.products?.name ?? "",
        product_upc:
          (productBOM.product_units as { products?: { upc: string } })?.products
            ?.upc ?? "",
        unit_name:
          (productBOM.product_units as { units?: { name: string } })?.units
            ?.name ?? "",
        bill_of_material_qty: String(productBOM.qty),
      })),
    );
  }, [productBillOfMaterials, productStock?.data]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const selected = selectedProduct[selectedIndex];
    if (!selected) return;

    update(selectedIndex, {
      ...fields[selectedIndex],
      product_units_id: String(selected.id ?? ""),
      product_name: selected.products?.name ?? "",
      product_upc: selected.products?.upc ?? "",
      unit_name: selected.units?.name ?? "",
      on_hand: selected?.on_hand ?? 0,
      bill_of_material_qty: "",
    });

    setSelectedProduct((prev) => {
      const { [String(selectedIndex)]: _, ...rest } = prev;
      return rest;
    });
    setSelectedIndex(null);

    form.setValue("product_name", selectedProduct.products?.products.name);
  }, [selectedIndex, selectedProduct, fields, update]);

  const BOMQTY = Number(form.watch("qty"));
  useEffect(() => {
    fields.forEach((field, index) => {
      const base = Number(field.bill_of_material_qty);

      const totalQTY = Number(BOMQTY) * base;

      form.setValue(`products_detail.${index}.qty`, String(totalQTY));
    });
  }, [BOMQTY]);

  const branchLocationId = form.watch("origin_branch_location_id");
  return (
    <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4">
      <FormField
        control={form.control}
        name={`bill_of_materials_id`}
        render={() => (
          <FormItem>
            <FormLabel>Bill Of Material</FormLabel>
            <FormControl>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  disabled={type === "Detail" || !branchLocationId}
                  placeholder="Click for searching BOM"
                  value={
                    selectedBOM?.bill_of_materials?.name ??
                    (billOfMaterials as { name?: string })?.name ??
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
      <FormField
        control={form.control}
        name={`product_units_id`}
        render={() => (
          <FormItem>
            <FormLabel>
              Product <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                value={displayProductName ?? ""}
                placeholder="Click for searching products"
                readOnly
                disabled={type === "Detail" || !branchLocationId}
                onClick={() => {
                  setActiveMapping({
                    key: "products",
                    products_id: "products_id",
                    units_id: "product_units_id",
                  });
                  setOpenDialog(true);
                }}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <div>
        <Label className="mb-2">Unit</Label>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Input disabled value={displayUnitName ?? ""} />
        )}
      </div>
      <FormInput
        isLoading={isLoading}
        disabled={type === "Detail" || !branchLocationId}
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
      <div
        className={cn(
          "grid col-span-full gap-2 ",
          type === "Detail"
            ? "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]"
            : "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto]",
        )}
      >
        <Label>Product Name</Label>
        <Label>UPC</Label>
        <Label>Unit</Label>
        <Label>Stock</Label>
        <Label>Required QTY</Label>
        <Label>Total QTY</Label>
        <Label></Label>
        {isLoadingProductBillOfMaterials || isLoading ? (
          <>
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
          </>
        ) : (
          fields.map((field, index) => {
            const selectedProducts = selectedProduct[index];
            return (
              <Fragment key={field.id}>
                <FormField
                  control={form.control}
                  name={`products_detail.${index}.product_units_id`}
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Input
                          value={
                            field.product_name ??
                            selectedProducts?.products.name ??
                            displayProductName ??
                            ""
                          }
                          placeholder="Click for searching products"
                          readOnly
                          disabled={type === "Detail" || !branchLocationId}
                          onClick={() => {
                            setSelectedIndex(index);
                            setActiveMapping({
                              key: `${index}`,
                              products_id: `products_detail.${index}products_id`,
                              units_id: `products_detail.${index}.product_units_id`,
                            });
                            setOpenDialog(true);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <Input value={field.product_upc} disabled />
                <Input value={field.unit_name} disabled />
                <Input value={field.on_hand} disabled />
                <Input value={field.bill_of_material_qty} disabled />
                <FormField
                  control={form.control}
                  name={`products_detail.${index}.qty`}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                            value={field.value}
                            disabled={type === "Detail"}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    );
                  }}
                />
                {fields.length > 1 && type !== "Detail" && (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => {
                      remove(index);
                      setSelectedProduct(({ [field.id]: _, ...rest }) => rest);
                    }}
                    className="cursor-pointer "
                  >
                    <X />
                  </Button>
                )}
              </Fragment>
            );
          })
        )}
        {type !== "Detail" && (
          <Button
            type="button"
            onClick={handleAddMaterial}
            className="col-start-1 w-1/2"
            variant="default"
          >
            <Plus />
            Add Material
          </Button>
        )}
      </div>
      <DialogProducts
        setSelectedProduct={setSelectedProduct}
        open={openDialog}
        onOpenChange={setOpenDialog}
        form={form}
        mapping={activeMapping}
        branch_location_id={branchLocationId}
      />
    </div>
  );
}

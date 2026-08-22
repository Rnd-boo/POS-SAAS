import DialogProducts from "@/components/common/dialog/dialog-products";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductStockQuery } from "@/hooks/queries/use-product-stocks";
import { cn } from "@/lib/utils";
import { UnitProduct } from "@/types/products/product-dialog";
import { StockAdjustmentForm } from "@/validations/inventory/stock-adjustment.validation";
import { Plus, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export default function FormStockAdjustmentItems({
  form,
  type,
  isLoading,
}: {
  form: UseFormReturn<StockAdjustmentForm>;
  type: "Detail" | "Create" | "Update" | "Approve";
  isLoading?: boolean;
}) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [activeMapping, setActiveMapping] = useState<Record<string, string>>(
    {},
  );
  const [selectedProduct, setSelectedProduct] = useState<
    Record<string, UnitProduct | null>
  >({});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { fields, append, remove, replace, update } = useFieldArray({
    control: form.control,
    name: "stock_adjustment_items",
  });
  const branchLocationId = form.watch("branch_location_id");
  const adjustmentItems = form.watch("stock_adjustment_items");
  const canAddItem =
    !adjustmentItems?.length ||
    Boolean(adjustmentItems[adjustmentItems.length - 1]?.product_name);

  const canSelectProduct = (selected: UnitProduct) => {
    const selectedProductId = String(selected.products_id ?? "");
    const duplicate = adjustmentItems?.some((item, index) => {
      if (index === selectedIndex) return false;
      return selectedProductId && item.products_id === selectedProductId;
    });

    if (duplicate) {
      toast.error("This product has already been selected.");
      return false;
    }

    return true;
  };

  const handleAddItem = () => {
    if (!canAddItem) {
      toast.error(
        "Please select a product for the last material before adding another.",
      );
      return;
    }

    append({
      product_units_id: "",
      products_id: "",
      current_qty: 0,
      on_hand: 0,
      product_name: "",
      product_upc: "",
      unit_name: "",
    });
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const selected = selectedProduct[selectedIndex];
    if (!selected) return;

    update(selectedIndex, {
      ...fields[selectedIndex],
      products_id: String(selected.products_id ?? ""),
      product_units_id: String(selected.id ?? ""),
      product_name: selected.products?.name ?? "",
      product_upc: selected.products?.upc ?? "",
      unit_name: selected.units?.name ?? "",
      on_hand: selected?.on_hand ?? 0,
    });

    setSelectedProduct((prev) => {
      const { [String(selectedIndex)]: _, ...rest } = prev;
      return rest;
    });
    setSelectedIndex(null);
  }, [selectedIndex, selectedProduct, fields, update]);

  const { productStock } = useProductStockQuery({
    branch_location_id: form.watch("branch_location_id"),
    productIds: fields
      .map((field) => field.products_id)
      .filter(Boolean) as string[],
  });

  useEffect(() => {
    if (type === "Create") return;
    const updatedFields = fields.map((field) => {
      let onHandValue =
        productStock?.data?.find(
          (stockRow) => stockRow.products_id === field.products_id,
        )?.on_hand ?? 0;
      onHandValue = onHandValue / (field.conversion_factor ?? 1);
      return {
        ...field,
        on_hand: onHandValue,
      };
    });

    replace(updatedFields);
  }, [productStock?.data]);

  return (
    <div
      className={cn(
        "grid col-span-full gap-2 ",
        type === "Detail"
          ? "grid-cols-[2fr_1fr_1fr_1fr_1fr]"
          : "grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]",
      )}
    >
      <Label>Product Name</Label>
      <Label>UPC</Label>
      <Label>Unit</Label>
      <Label>Stock</Label>
      <Label>Current QTY</Label>
      {type !== "Detail" && <Label></Label>}
      {isLoading ? (
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
                name={`stock_adjustment_items.${index}.product_units_id`}
                render={() => (
                  <FormItem>
                    <FormControl>
                      <Input
                        value={
                          field.product_name ??
                          selectedProducts?.products.name ??
                          ""
                        }
                        placeholder="Click for searching products"
                        readOnly
                        disabled={
                          type === "Approve" ||
                          type === "Detail" ||
                          !branchLocationId
                        }
                        onClick={() => {
                          setSelectedIndex(index);
                          setActiveMapping({
                            key: `${index}`,
                            products_id: `stock_adjustment_items.${index}products_id`,
                            units_id: `stock_adjustment_items.${index}.product_units_id`,
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
              <FormField
                control={form.control}
                name={`stock_adjustment_items.${index}.current_qty`}
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
                          disabled={type === "Detail" || type === "Approve"}
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
      {type !== "Detail" && type !== "Approve" && (
        <Button
          type="button"
          onClick={handleAddItem}
          className="col-start-1 w-1/2"
          variant="default"
        >
          <Plus />
          Add Material
        </Button>
      )}
      <DialogProducts
        setSelectedProduct={setSelectedProduct}
        open={openDialog}
        onOpenChange={setOpenDialog}
        form={form}
        mapping={activeMapping}
        branch_location_id={branchLocationId}
        canSelectProduct={canSelectProduct}
      />
    </div>
  );
}

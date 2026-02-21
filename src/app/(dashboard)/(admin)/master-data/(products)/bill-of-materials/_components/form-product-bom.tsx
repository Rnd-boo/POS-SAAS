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
import { DisplayName } from "@/constants/products/bill-of-materials.constant";
import { cn } from "@/lib/utils";
import { UnitProduct } from "@/types/products/product-dialog";
import { BillOfMaterialsForm } from "@/validations/products/bill-of-materials-validation";
import { Plus, X } from "lucide-react";
import { Dispatch, Fragment, SetStateAction } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

export default function FormProductBOM({
  form,
  type,
  selectedProduct,
  setSelectedProduct,
  setOpen,
  setActiveMapping,
  displayNames,
}: {
  form: UseFormReturn<BillOfMaterialsForm>;
  type: "Detail" | "Create" | "Update";
  selectedProduct: Record<string, UnitProduct | null>;
  setSelectedProduct: Dispatch<
    SetStateAction<Record<string, UnitProduct | null>>
  >;
  setOpen: (open: boolean) => void;
  setActiveMapping: (mapping: Record<string, string>) => void;
  displayNames?: Record<string, DisplayName | DisplayName[]>;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "product_bom",
  });
  const handleAddProductBOM = () => {
    append({
      product_units_id: "",
      qty: "",
      wastePercentage: 0,
      waste: 0,
    });
  };

  const getDisplayName = (index: number) => {
    const displayProductBOMNames = displayNames?.product_bom;
    if (!Array.isArray(displayProductBOMNames))
      return { productName: "", unitName: "" };
    return displayProductBOMNames[index] || { productName: "", unitName: "" };
  };

  return (
    <>
      <div
        className={cn(
          "grid gap-x-2 gap-y-2",
          type === "Detail"
            ? "grid-cols-[2fr_1fr_1fr_1fr_1fr]"
            : "grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]",
        )}
      >
        <Label>Product</Label>
        <Label>Unit</Label>
        <Label>QTY</Label>
        <Label>Waste%</Label>
        <Label>Waste QTY</Label>
        {type !== "Detail" && <div></div>}
        {fields.map((field, index) => {
          const selectedProducts = selectedProduct[field.id];
          const qty = form.watch(`product_bom.${index}.qty`);
          const {
            productName: updateProductName,
            unitName: updateUnitProductName,
          } = getDisplayName(index);

          return (
            <Fragment key={field.id}>
              <FormField
                control={form.control}
                name={`product_bom.${index}.product_units_id`}
                render={() => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        value={
                          selectedProducts?.products?.name ??
                          updateProductName ??
                          ""
                        }
                        readOnly
                        placeholder="Click for searching products"
                        disabled={type === "Detail"}
                        onClick={() => {
                          setActiveMapping({
                            key: field.id,
                            products_id: `product_bom.${index}.products_id`,
                            units_id: `product_bom.${index}.product_units_id`,
                          });
                          setOpen(true);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`product_bom.${index}.product_units_id`}
                render={() => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        value={
                          selectedProducts?.units?.name ??
                          updateUnitProductName ??
                          ""
                        }
                        placeholder="Select product"
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormInput
                form={form}
                label=""
                name={`product_bom.${index}.qty`}
                placeholder="Quantity"
                disabled={type === "Detail"}
                onChange={(e) => {
                  const qty = Number(e) || 0;
                  const wastePercentage =
                    Number(
                      form.watch(`product_bom.${index}.wastePercentage`),
                    ) || 0;

                  const waste = qty * (wastePercentage / 100);

                  form.setValue(
                    `product_bom.${index}.waste`,
                    Number(waste.toFixed(2)),
                    { shouldDirty: false },
                  );
                }}
              />
              <FormInput
                type="number"
                form={form}
                label=""
                disabled={qty === "" || type === "Detail"}
                name={`product_bom.${index}.wastePercentage`}
                onChange={(e) => {
                  const wastePercentage = Number(e) || 0;
                  const qty =
                    Number(form.watch(`product_bom.${index}.qty`)) || 0;

                  const waste = qty * (wastePercentage / 100);

                  form.setValue(
                    `product_bom.${index}.waste`,
                    Number(waste.toFixed(2)),
                    { shouldDirty: false },
                  );
                }}
              />
              <FormInput
                form={form}
                label=""
                disabled={qty === "" || type === "Detail"}
                name={`product_bom.${index}.waste`}
                onChange={(e) => {
                  const wasteQty = Number(e);
                  const qty = Number(form.watch(`product_bom.${index}.qty`));

                  const wastePercentage = (100 * wasteQty) / qty;

                  form.setValue(
                    `product_bom.${index}.wastePercentage`,
                    Number(wastePercentage.toFixed(4)),
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
                  className="cursor-pointer mt-2"
                >
                  <X />
                </Button>
              )}
            </Fragment>
          );
        })}
      </div>
      {type !== "Detail" && (
        <Button
          type="button"
          onClick={handleAddProductBOM}
          className="col-start-1 mt-2"
          variant="outline"
        >
          <Plus />
          Add
        </Button>
      )}
      <Separator className="my-4" />
      <FormInput
        readOnly={type === "Detail"}
        type="textarea"
        form={form}
        label="Description"
        name="description"
        placeholder="Optional Add note..."
      />
    </>
  );
}

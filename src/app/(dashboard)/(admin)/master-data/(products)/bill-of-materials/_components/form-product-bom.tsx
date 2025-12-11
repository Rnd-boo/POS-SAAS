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
import { cn } from "@/lib/utils";
import { BillOfMaterialsForm } from "@/validations/products/bill-of-materials-validation";
import { Plus, X } from "lucide-react";
import { Fragment, useEffect } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

export default function FormProductBOM({
  form,
  type,
  displayNames,
  setOpen,
  setActiveMapping,
}: {
  form: UseFormReturn<BillOfMaterialsForm>;
  type: "Detail" | "Create" | "Update";
  displayNames: Record<string, string>;
  setOpen: (open: boolean) => void;
  setActiveMapping: (mapping: Record<string, string>) => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "product_bom",
  });
  const handleAddProductBOM = () => {
    append({
      products_id: "",
      product_units_id: "",
      qty: 0,
      wastePercentage: 0,
      waste: 0,
    });
  };

  useEffect(() => {
    fields.forEach((item, index) => {
      const qty = Number(form.watch(`product_bom.${index}.qty`)) || 0;
      const waste =
        Number(form.watch(`product_bom.${index}.wastePercentage`)) || 0;

      const wastePercentage = waste / 100;

      const handleWaste = wastePercentage === 0 ? 0 : qty * wastePercentage;
      form.setValue(
        `product_bom.${index}.waste`,
        Number(handleWaste.toFixed(2))
      );
    });
  }, [fields]);

  return (
    <>
      <div
        className={cn(
          "grid gap-x-2 ",
          type === "Detail"
            ? "grid-cols-[2fr_1fr_1fr_1fr_1fr]"
            : "grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]"
        )}
      >
        <Label>Product</Label>
        <Label>Unit</Label>
        <Label>QTY</Label>
        <Label>Waste%</Label>
        <Label>Waste QTY</Label>
        {type !== "Detail" && <div></div>}
        {fields.map((field, index) => (
          <Fragment key={field.id}>
            <FormField
              control={form.control}
              name={`product_bom.${index}.products_id`}
              render={({ field: { ...rest } }) => (
                <FormItem className="w-full">
                  <FormLabel></FormLabel>
                  <FormControl>
                    <Input
                      {...rest}
                      value={
                        displayNames[`product_bom.${index}.products_id`] || ""
                      }
                      placeholder="Click for searching products"
                      disabled={type === "Detail"}
                      onClick={() => {
                        setActiveMapping({
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
            <FormInput
              displayValue={
                displayNames[`product_bom.${index}.product_units_id`] || ""
              }
              form={form}
              label=""
              name={`product_bom.${index}.product_units_id`}
              placeholder="Select product"
              disabled
            />
            <FormInput
              form={form}
              label=""
              name={`product_bom.${index}.qty`}
              placeholder="Quantity"
            />
            <FormInput
              form={form}
              label=""
              name={`product_bom.${index}.wastePercentage`}
            />
            <FormInput
              form={form}
              label=""
              name={`product_bom.${index}.waste`}
              disabled
            />
            {fields.length > 1 && type !== "Detail" && (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => remove(index)}
                className="cursor-pointer mt-2"
              >
                <X />
              </Button>
            )}
          </Fragment>
        ))}
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
        type="textarea"
        form={form}
        label="Description"
        name="description"
        placeholder="Optional Add note..."
      />
    </>
  );
}

import FormCombobox from "@/components/common/form/form-combobox";
import FormDatePicker from "@/components/common/form/form-date-picker";
import FormInput from "@/components/common/form/form-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import { cn } from "@/lib/utils";
import { PurchaseOrderForm } from "@/validations/purchasing/purchase-order.validation";
import { Plus, X } from "lucide-react";
import { Fragment } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

export default function FormPurchaseOrder({
  form,
  type,
  isLoading,
}: {
  form: UseFormReturn<PurchaseOrderForm>;
  type: "Detail" | "Create" | "Update";
  isLoading: boolean;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "purchase_order_item",
  });
  const { data: branches, isLoading: isLoadingBranch } = useBranchQuery();
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 border p-4 rounded-2xl">
        <p className="col-span-full text-md font-medium text-muted-foreground">
          Purchase Order
        </p>
        <FormCombobox
          form={form}
          items={branches || []}
          label="Branch"
          name="branch_id"
          isLoading={isLoading || isLoadingBranch}
          required
        />
        <div />
        <FormDatePicker
          form={form}
          name="purchase_order_date"
          label="Purchase order date"
          required
          disabled={type === "Detail"}
          isLoading={isLoading}
        />
        <FormDatePicker
          form={form}
          name="required_date"
          label="Required date"
          disabled={type === "Detail"}
          required
          isLoading={isLoading}
        />
      </div>
      <div className="grid grid-cols-4 border rounded-2xl p-4 my-4 gap-4">
        <h3 className="font-medium text-muted-foreground col-span-full">
          Supplier
        </h3>
        <FormCombobox
          form={form}
          items={branches || []}
          label="Supplier"
          name="supplier_id"
          isLoading={isLoading || isLoadingBranch}
          required
        />
        <div className="col-span-2" />
        <Input placeholder="PIC" disabled />
        <Input placeholder="phone" disabled />
        <Input placeholder="credit terms" disabled />
        <Input placeholder="due days" />
      </div>
      <div className="border rounded-2xl p-4 my-4">
        <h3 className="font-medium text-muted-foreground mb-4 ">
          Product details
        </h3>
        <div
          className={cn(
            "grid gap-2",
            type === "Detail"
              ? "grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto]"
              : "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto]",
          )}
        >
          <Label>
            Product <span className="text-destructive">*</span>
          </Label>
          <Label>Unit</Label>
          <Label>Stock</Label>
          <Label>Last Price</Label>
          <Label>Price</Label>
          <Label>PO Qty</Label>
          <Label>Discount</Label>
          <Label>Total</Label>
          {type !== "Detail" && <Label></Label>}
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <FormInput
                form={form}
                name={`purchase_order_item.${index}.products_units_id`}
                disabled={type === "Detail"}
                isLoading={isLoading}
              />
              <Input disabled />
              <Input disabled />
              <Input disabled />
              <FormInput
                form={form}
                name={`purchase_order_item.${index}.price`}
                disabled={type === "Detail"}
                isLoading={isLoading}
              />
              <FormInput
                form={form}
                name={`purchase_order_item.${index}.qty`}
                disabled={type === "Detail"}
                isLoading={isLoading}
              />
              <FormInput
                form={form}
                name={`purchase_order_item.${index}.discount`}
                disabled={type === "Detail"}
                isLoading={isLoading}
              />
              <Input disabled />
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
          <Input />
          <Input disabled />
          <Input disabled />
          <Input disabled />
          <Input />
          <Input />
          <Input />
          <Input disabled />
        </div>
        {type !== "Detail" && (
          <Button type="button" variant="outline" size="sm" className="mt-4">
            <Plus /> Product
          </Button>
        )}
      </div>
      <div className="border rounded-2xl p-4 grid grid-cols-3 gap-4">
        <h3 className="font-medium text-muted-foreground col-span-full">
          Summary
        </h3>
        <FormInput
          form={form}
          name="notes"
          type="textarea"
          label="Notes"
          disabled={type === "Detail"}
          className=" col-span-2"
          isLoading={isLoading}
        />
        <FormInput
          form={form}
          name="notes"
          label="Total Purchase"
          className="mb-auto"
          isLoading={isLoading}
          disabled
        />
      </div>
    </div>
  );
}

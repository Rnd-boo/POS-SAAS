import FormCombobox from "@/components/common/form/form-combobox";
import FormDatePicker from "@/components/common/form/form-date-picker";
import FormInput from "@/components/common/form/form-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useSupplierDetail,
  useSupplierQuery,
} from "@/hooks/queries/use-supplier";
import { cn } from "@/lib/utils";
import { PurchaseOrderForm } from "@/validations/purchasing/purchase-order.validation";
import { Plus, X } from "lucide-react";
import { Fragment, useEffect } from "react";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";

export default function FormPurchaseOrder({
  form,
  type,
  isLoading,
  branches,
}: {
  form: UseFormReturn<PurchaseOrderForm>;
  type: "Detail" | "Create" | "Update";
  isLoading: boolean;
  branches: { id: string; name: string }[];
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "purchase_order_item",
  });
  const { data: suppliers = [], isLoading: isLoadingSupplier } =
    useSupplierQuery();

  const supplierId = useWatch({ control: form.control, name: "supplier_id" });
  const { data: supplierPIC } = useSupplierDetail(supplierId);
  const selectedSupplier = suppliers.find(
    (supplier) => String(supplier.id) === supplierId,
  );
  useEffect(() => {
    form.setValue("due_days", selectedSupplier?.credit_terms);
  }, [selectedSupplier]);

  const handleAddProduct = () =>
    append({
      products_units_id: "",
      old_price: 0,
      new_price: 0,
      discount: 0,
      qty: 0,
    });
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 border p-4 rounded-2xl">
        <p className="col-span-full text-md font-medium text-muted-foreground">
          Purchase Order
        </p>
        <FormCombobox
          form={form}
          items={branches}
          label="Branch"
          name="branch_id"
          isLoading={isLoading}
          required
        />
        <div className="col-span-2" />
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
        <div className="col-span-2">
          <FormCombobox
            form={form}
            items={suppliers}
            label="Supplier"
            name="supplier_id"
            isLoading={isLoadingSupplier}
            required
          />
        </div>
        <div className="col-span-2" />
        <div>
          <Label className="mb-2">Person in Charge</Label>
          <Input
            placeholder="PIC"
            disabled
            value={supplierPIC?.[0]?.name ?? ""}
          />
        </div>
        <div>
          <Label className="mb-2">Phone number</Label>
          <Input
            placeholder="Phone"
            disabled
            value={supplierPIC?.[0]?.phone || "-"}
          />{" "}
        </div>
        <div>
          <Label className="mb-2">Supplier Credit terms</Label>
          <Input
            placeholder="Supplier Credit terms"
            disabled
            value={selectedSupplier?.credit_terms ?? ""}
          />{" "}
        </div>
        <FormInput
          form={form}
          name="due_days"
          disabled={type === "Detail"}
          isLoading={isLoading}
          placeholder="Due days"
          label="Due days"
          required
        />
      </div>
      <div className="border rounded-2xl p-4 my-4">
        <h3 className="font-medium text-muted-foreground mb-4 ">
          Product details
        </h3>
        <div
          className={cn(
            "grid gap-2",
            type === "Detail"
              ? "grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto]"
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
              <FormInput
                form={form}
                name={`purchase_order_item.${index}.old_price`}
                disabled
                isLoading={isLoading}
              />
              <FormInput
                form={form}
                name={`purchase_order_item.${index}.new_price`}
                disabled={type === "Detail"}
                isLoading={isLoading}
                type="number"
              />
              <FormInput
                form={form}
                name={`purchase_order_item.${index}.qty`}
                disabled={type === "Detail"}
                isLoading={isLoading}
                type="number"
              />
              <FormInput
                form={form}
                name={`purchase_order_item.${index}.discount`}
                disabled={type === "Detail"}
                isLoading={isLoading}
                type="number"
              />
              <Input disabled />
              {fields.length > 1 && type !== "Detail" && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => remove(index)}
                  className="cursor-pointer "
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
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={handleAddProduct}
          >
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
          name="status"
          label="Total Purchase"
          className="mb-auto"
          isLoading={isLoading}
          disabled
        />
      </div>
    </div>
  );
}

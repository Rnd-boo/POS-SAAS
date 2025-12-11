"use client";

import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { STATUS_LIST } from "@/constants/general.constant";
import { BillOfMaterialsForm } from "@/validations/products/bill-of-materials-validation";
import { UseFormReturn } from "react-hook-form";

export default function FormBillOfMaterial({
  form,
  type,
  setOpen,
  displayNames,
  setActiveMapping,
}: {
  form: UseFormReturn<BillOfMaterialsForm>;
  type: "Create" | "Detail" | "Update";
  setOpen: (open: boolean) => void;
  displayNames: Record<string, string>;
  setActiveMapping: (mapping: Record<string, string>) => void;
}) {
  const TYPE_LIST = [
    { value: "assembly", label: "Assembly" },
    { value: "diassembly", label: "Diassembly" },
    { value: "menu", label: "Menu" },
  ];

  return (
    <>
      <div className="w-full gap-4 grid grid-cols-[1fr_1fr_2fr]">
        <FormSelect
          form={form}
          name="type"
          selectItem={TYPE_LIST}
          label="Type"
          disabled={type === "Detail"}
        />
        <FormInput
          form={form}
          label="Bill Of Material Code"
          name="code"
          placeholder="Insert BOM code"
          disabled={type === "Detail"}
        />
        <FormInput
          form={form}
          label="Bill Of Material Name"
          name="name"
          placeholder="Insert BOM name"
          disabled={type === "Detail"}
        />
      </div>
      <div className="w-full gap-4 grid grid-cols-[2fr_2fr_1fr] mt-4">
        <FormField
          control={form.control}
          name="products_id"
          render={({ field: { ...rest } }) => (
            <FormItem className="w-full">
              <FormLabel>Product</FormLabel>
              <FormControl>
                <Input
                  {...rest}
                  value={displayNames["products_id"] || ""}
                  onClick={() => {
                    setActiveMapping({
                      products_id: "products_id",
                      units_id: "product_units_id",
                    });
                    setOpen(true);
                  }}
                  placeholder="Click for searching products"
                  disabled={type === "Detail"}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormInput
          displayValue={displayNames["product_units_id"] || ""}
          form={form}
          label="Unit"
          name="product_units_id"
          placeholder="Select product"
          disabled
        />
        <FormSelect
          form={form}
          name="status"
          selectItem={STATUS_LIST}
          label="Status"
          disabled={type === "Detail"}
        />
      </div>
    </>
  );
}

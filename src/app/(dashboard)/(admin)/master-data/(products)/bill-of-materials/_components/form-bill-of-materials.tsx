"use client";

import FormInput from "@/components/common/form/form-input";
import FormSelect from "@/components/common/form/form-select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { STATUS_LIST } from "@/constants/general.constant";
import { UnitProduct } from "@/types/products/product-dialog";
import { BillOfMaterialsForm } from "@/validations/products/bill-of-materials-validation";
import { UseFormReturn } from "react-hook-form";

export default function FormBillOfMaterial({
  form,
  type,
  setOpen,
  selectedProduct,
  setActiveMapping,
  displayNames,
}: {
  form: UseFormReturn<BillOfMaterialsForm>;
  type: "Create" | "Detail" | "Update";
  setOpen: (open: boolean) => void;
  selectedProduct: Record<string, UnitProduct | null>;
  setActiveMapping: (mapping: Record<string, string>) => void;
  displayNames?: Record<
    string,
    | { productName?: string; unitName?: string }
    | { productName?: string; unitName?: string }[]
  >;
}) {
  const TYPE_LIST = [
    { value: "assembly", label: "Assembly" },
    { value: "disassembly", label: "Disassembly" },
    { value: "menu", label: "Menu" },
  ];
  const selectedProducts = selectedProduct["bill_of_materials"];
  const productId = (
    displayNames?.bill_of_materials as { productName?: string } | undefined
  )?.productName;
  const productUnitId = (
    displayNames?.bill_of_materials as { unitName?: string } | undefined
  )?.unitName;

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
          name={`product_units_id`}
          render={() => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <FormControl>
                <Input
                  value={selectedProducts?.products?.name ?? productId ?? ""}
                  placeholder="Click for searching products"
                  readOnly
                  disabled={type === "Detail"}
                  onClick={() => {
                    setActiveMapping({
                      key: "bill_of_materials",
                      products_id: "products_id",
                      units_id: "product_units_id",
                    });
                    setOpen(true);
                  }}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Unit</FormLabel>
          <FormControl>
            <Input
              value={selectedProducts?.units?.name ?? productUnitId ?? ""}
              placeholder="Select product"
              disabled
            />
          </FormControl>
        </FormItem>
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

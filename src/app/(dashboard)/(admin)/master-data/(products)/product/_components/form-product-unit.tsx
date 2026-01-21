"use client";

import FormInput from "@/components/common/form-input";
import FormSelectData from "@/components/common/form-select-data";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { ProductUnit } from "@/validations/products/product-validation";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { Fragment, useEffect } from "react";
import {
  ArrayPath,
  FieldValues,
  Path,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";

export default function FormProductUnit<T extends FieldValues>({
  form,
}: {
  form: UseFormReturn<T>;
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const { data: units } = useQuery({
    queryKey: ["units", currentId],
    queryFn: async () => {
      const result = await supabase
        .from("units")
        .select("id,name")
        .eq("status", true)
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId);
      return result?.data;
    },
    enabled: !!currentId,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "units" as ArrayPath<T>,
  });

  const selectedUnitId = form.watch("units.0.units_id" as Path<T>) || "";
  const selectedUnit = units?.find((unit) => unit.id == selectedUnitId);

  const handleAppend = () => {
    append({
      units_id: "",
      conversion_factor: "",
      base_unit: "",
      is_sales_unit: "false",
    } as any);
  };
  useEffect(() => {
    if (selectedUnit && fields.length > 0) {
      fields.forEach((_, fieldIndex) => {
        form.setValue(
          `units.${fieldIndex}.base_unit` as Path<T>,
          selectedUnit.name,
        );
      });
    }
  }, [selectedUnit?.id, fields.length, form]);

  useEffect(() => {
    if (fields.length > 0) {
      form.setValue("units.0.conversion_factor" as Path<T>, "1" as any);
    }
  }, [fields]);

  useEffect(() => {
    if (currentBrandId) {
      fields.forEach((_, index) => {
        form.setValue(
          `units.${index}.brand_id` as Path<T>,
          Number(currentBrandId) as any,
        );
      });
    }
  }, [currentBrandId, fields]);
  return (
    <>
      <div className="grid grid-cols-7 gap-x-2 mb-4">
        {/* Header */}
        <Label>Unit</Label>
        <Label>Conversion Factor</Label>
        <Label>Base Unit</Label>
        <div></div>
        <Label className="flex justify-center">Sales Unit</Label>
        <div></div>
        <div></div>

        {fields.map((field, index) => {
          const filteredUnits = units?.filter((unit) => {
            const selected = form
              .watch("units" as Path<T>)
              ?.map((row: ProductUnit) => row.units_id)
              .filter((id: number, i: number) => i !== index);
            return !selected?.includes(unit.id.toString());
          });
          return (
            <Fragment key={field.id}>
              <FormSelectData
                form={form}
                name={`units.${index}.units_id` as Path<T>}
                label=""
                data={filteredUnits ?? undefined}
                valueKey="id"
                labelKey="name"
              />
              <FormInput
                form={form}
                name={`units.${index}.conversion_factor` as Path<T>}
                label=""
                placeholder="Conversion"
                className=""
                disabled={index === 0}
              />
              <FormInput
                form={form}
                name={`units.${index}.base_unit` as Path<T>}
                label=""
                placeholder="Base Unit"
                className=""
                disabled
              />
              <div>
                {fields.length > 1 && index > 0 && (
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
              </div>
              <div className="flex justify-center">
                <Checkbox
                  className="mt-4 size-6 "
                  checked={
                    form.watch(`units.${index}.is_sales_unit` as Path<T>) ===
                    true
                  }
                  onCheckedChange={(checked) => {
                    const currentUnits = form.getValues("units" as Path<T>);

                    // Update all: only clicked one should be "true"
                    const updatedUnits = currentUnits.map(
                      (unit: ProductUnit, i: number) => ({
                        ...unit,
                        is_sales_unit: i === index && checked,
                      }),
                    );

                    form.setValue("units" as Path<T>, updatedUnits);
                  }}
                />
              </div>
              <div></div>
              <div></div>
            </Fragment>
          );
        })}
      </div>
      <Button
        size="sm"
        type="button"
        variant="outline"
        className="mt-2"
        onClick={handleAppend}
      >
        <Plus />
        Add Unit
      </Button>
    </>
  );
}

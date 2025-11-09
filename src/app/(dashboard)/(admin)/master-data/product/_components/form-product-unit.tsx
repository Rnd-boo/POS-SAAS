"use client";

import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import FormSelectData from "@/components/common/form-select-data";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";
import {
  ArrayPath,
  FieldValues,
  Path,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";

type FormProductUnitProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  units?: { id: string; name: string }[];
};

export default function FormProductUnit<T extends FieldValues>({
  form,
}: FormProductUnitProps<T>) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const { data: units } = useQuery({
    queryKey: ["units", currentId],
    queryFn: async () => {
      const result = await supabase
        .from("units")
        .select("id,name")
        .eq("status", true)
        .eq("clients_id", currentId);
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
    } as any);
  };
  useEffect(() => {
    if (selectedUnit && fields.length > 0) {
      fields.forEach((_, fieldIndex) => {
        form.setValue(
          `units.${fieldIndex}.base_unit` as Path<T>,
          selectedUnit.name || ("" as any)
        );
      });
    }
  }, [selectedUnit?.id, fields.length, form]);
  // Set conversion_factor to "1" for the first unit (base unit)
  useEffect(() => {
    if (fields.length > 0) {
      form.setValue("units.0.conversion_factor" as Path<T>, "1" as any);
    }
  }, [fields, form]);

  return (
    <div>
      {fields.map((field, index) => (
        <div className="flex w-full gap-2  items-start" key={field.id}>
          <FormSelectData
            form={form}
            name={`units.${index}.units_id` as Path<T>}
            label=""
            data={units ?? undefined}
            valueKey="id"
            labelKey="name"
            className="min-w-[150px]"
          />
          <FormInput
            form={form}
            name={`units.${index}.conversion_factor` as Path<T>}
            label=""
            placeholder="Conversion"
            className="max-w-[100px]"
            disabled={index === 0}
          />
          <FormInput
            form={form}
            name={`units.${index}.base_unit` as Path<T>}
            label=""
            placeholder="Base Unit"
            className="max-w-[100px]"
            disabled
          />
          {fields.length > 1 && index > 0 && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => remove(index)}
              className="cursor-pointer self-end"
            >
              <X />
            </Button>
          )}
        </div>
      ))}
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
    </div>
  );
}

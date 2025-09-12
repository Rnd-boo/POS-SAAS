import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  units,
}: FormProductUnitProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "units" as ArrayPath<T>,
  });

  const selectedUnitId = form.watch("units.0.units_id" as Path<T>) || "";

  const selectedUnit = units?.find((unit) => unit.id == selectedUnitId);

  // Set conversion_factor to "1" for the first unit (base unit)
  useEffect(() => {
    if (fields.length > 0) {
      form.setValue("units.0.conversion_factor" as Path<T>, "1" as any);
    }
  }, [fields, form]);

  return (
    <div>
      {fields.map((field, index) => (
        <div className="flex w-full gap-2 mb-2" key={field.id}>
          <FormSelect
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
          <Input
            name={`units.${index}.base_unit`}
            disabled
            value={selectedUnit?.name || ""}
            className="w-[150px] self-end"
          />
          {fields.length > 1 && index > 0 && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => remove(index)}
              className="self-end cursor-pointer"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        size="sm"
        type="button"
        variant="outline"
        onClick={() =>
          append({
            units_id: "",
            conversion_factor: "",
          } as any)
        }
      >
        <Plus />
        Add Unit
      </Button>
    </div>
  );
}

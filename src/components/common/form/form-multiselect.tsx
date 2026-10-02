import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelectCombobox } from "../manual-multiselect-combobox";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

export default function FormMultiselect<T extends FieldValues>({
  form,
  label,
  name,
  disabled = false,
  className,
  isLoading,
  required,
  items,
  valueKey,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  required?: boolean;
  items: { name: string; id: string }[];
  valueKey?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            {isLoading ? (
              <Skeleton className="h-9" />
            ) : (
              <MultiSelectCombobox
                disabled={disabled}
                items={
                  items?.map((item) => ({
                    label: item.name,
                    value: String(item.id),
                  })) || []
                }
                values={
                  Array.isArray(field.value)
                    ? field.value.map((v: any) =>
                        typeof v === "string" ? v : v[valueKey || "id"],
                      )
                    : []
                }
                onChange={(values) => {
                  field.onChange(
                    values.map((id) => ({ [valueKey || "id"]: id })),
                  );
                }}
                className={cn(className)}
              />
            )}
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

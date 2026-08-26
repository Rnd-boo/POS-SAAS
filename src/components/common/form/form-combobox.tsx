import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Combobox } from "../manual-combobox";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormCombobox<T extends FieldValues>({
  form,
  label,
  name,
  disabled = false,
  className,
  isLoading,
  required,
  items,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  required?: boolean;
  items: { name: string; id: string }[];
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
              <Combobox
                disabled={disabled}
                modal
                items={
                  items?.map((item) => ({
                    label: item.name,
                    value: String(item.id),
                  })) || []
                }
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                className={className}
              />
            )}
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

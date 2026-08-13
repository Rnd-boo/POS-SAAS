import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Checkbox } from "../../ui/checkbox";
import { Skeleton } from "../../ui/skeleton";

export default function FormCheckbox<T extends FieldValues>({
  form,
  label,
  name,
  disabled = false,
  className,
  isLoading,
  required,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  required?: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            {isLoading ? (
              <Skeleton className="h-6 w-6" />
            ) : (
              <Checkbox
                checked={Boolean(field.value)}
                onCheckedChange={(checked) => field.onChange(checked)}
                disabled={disabled}
              />
            )}
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

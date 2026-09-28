import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../../ui/form";
import StatusSwitch from "../status-switch";

export default function FormStatusSwitch<T extends FieldValues>({
  form,
  name,
  disabled = false,
  className,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { ...rest } }) => (
        <FormItem className={className}>
          <FormControl>
            <StatusSwitch
              {...rest}
              onChange={(e) => {
                rest.onChange(e);
              }}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

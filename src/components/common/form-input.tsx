import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Skeleton } from "../ui/skeleton";

export default function FormInput<T extends FieldValues>({
  form,
  label,
  name,
  placeholder,
  type = "text",
  disabled = false,
  className,
  isLoading,
  readOnly,
  displayValue,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  readOnly?: boolean;
  displayValue?: string | number;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { ...rest } }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : type === "textarea" ? (
              <Textarea
                {...rest}
                placeholder={placeholder}
                autoComplete="off"
                className="resize-none"
                disabled={disabled}
                readOnly={readOnly}
              />
            ) : (
              <Input
                {...rest}
                value={displayValue ?? rest.value}
                type={type}
                placeholder={placeholder}
                autoComplete="off"
                disabled={disabled}
                readOnly={readOnly}
              />
            )}
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

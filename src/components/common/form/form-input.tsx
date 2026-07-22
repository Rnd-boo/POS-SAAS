import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Skeleton } from "../../ui/skeleton";

export default function FormInput<T extends FieldValues>({
  form,
  label,
  name,
  placeholder,
  type = "text",
  disabled = false,
  className,
  isLoading,
  readOnly = false,
  required,
  onChange,
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
  required?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { ...rest } }) => (
        <FormItem className={className}>
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
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
                type={type}
                placeholder={placeholder}
                autoComplete="off"
                disabled={disabled}
                readOnly={readOnly}
                onChange={(e) => {
                  rest.onChange(e);
                  onChange?.(e.target.value);
                }}
              />
            )}
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

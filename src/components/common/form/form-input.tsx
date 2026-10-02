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
import { ReactNode, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";

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
  tooltip,
  onChange,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  readOnly?: boolean;
  required?: boolean;
  tooltip?: ReactNode;
  onChange?: (value: string) => void;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { ...rest } }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}{" "}
              {tooltip}
            </FormLabel>
          )}
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
            ) : type === "password" ? (
              <InputGroup>
                <InputGroupInput
                  {...rest}
                  id="inline-end-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  autoComplete="off"
                  disabled={disabled}
                  onChange={(e) => {
                    rest.onChange(e);
                    onChange?.(e.target.value);
                  }}
                />
                <InputGroupAddon
                  align="inline-end"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </InputGroupAddon>
              </InputGroup>
            ) : (
              <Input
                {...rest}
                type={type}
                value={rest.value === 0 ? "" : rest.value}
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

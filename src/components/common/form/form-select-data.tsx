import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";

export default function FormSelectData<T extends FieldValues>({
  form,
  name,
  label,
  data,
  valueKey = "id",
  disabled = false,
  labelKey = "name",
  disabledKey,
  className = "w-full",
  isLoading,
  required,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  data?: any[];
  valueKey?: string;
  disabled?: boolean;
  labelKey?: string;
  disabledKey?: string;
  className?: string;
  isLoading?: boolean;
  required?: boolean;
}) {
  const selectItems = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      value: item[valueKey]?.toString() || "",
      label: item[labelKey] || "",
      disabled: disabledKey ? Boolean(item[disabledKey]) : false,
    }));
  }, [data, valueKey, labelKey, disabledKey]);

  useEffect(() => {
    if (selectItems.length === 0) return;

    const currentValue = form.getValues(name);

    // Only select first item if there is currently no value
    if (!currentValue) {
      form.setValue(name, selectItems[0].value as any);
    }
  }, [selectItems, form, name]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled || !data || data.length === 0 || isLoading}
              >
                <SelectTrigger
                  className={cn("w-full", {
                    "border-red-500": form.formState.errors[name]?.message,
                  })}
                >
                  <SelectValue
                    placeholder={
                      !data || data.length === 0
                        ? "No data..."
                        : isLoading
                          ? "Loading..."
                          : `Select ${label}`
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {selectItems.map((item) => (
                      <SelectItem
                        key={`${item.value}-${item.label}`}
                        value={item.value}
                        disabled={item.disabled}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        );
      }}
    />
  );
}

import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
}) {
  const mountedRef = useRef(false);
  const initialValueSetRef = useRef(false);

  const selectItems = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      value: item[valueKey]?.toString() || "",
      label: item[labelKey] || "",
      disabled: disabledKey ? Boolean(item[disabledKey]) : false,
    }));
  }, [data, valueKey, labelKey, disabledKey]);

  useEffect(() => {
    if (data && data.length > 0) {
      const timer = setTimeout(() => {
        mountedRef.current = true;
      }, 50); // Small delay to ensure data is ready

      return () => clearTimeout(timer);
    }
  }, [data]);

  // Don't render until data is available
  if (!data || data.length === 0) {
    return (
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Select disabled={true}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="No data..." />
            </SelectTrigger>
          </Select>
        </FormControl>
        <FormMessage className="text-xs" />
      </FormItem>
    );
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const currentValue = field.value?.toString() || "";

        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Select
                value={currentValue}
                onValueChange={(value) => {
                  if (!mountedRef.current) {
                    return;
                  }

                  if (!initialValueSetRef.current && currentValue && !value) {
                    initialValueSetRef.current = true;
                    return;
                  }

                  initialValueSetRef.current = true;
                  field.onChange(value || "");
                }}
                disabled={disabled}
              >
                <SelectTrigger
                  className={cn("w-full", {
                    "border-red-500": form.formState.errors[name]?.message,
                  })}
                >
                  <SelectValue placeholder={`Select ${label}`} />
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

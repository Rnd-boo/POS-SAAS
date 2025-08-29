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
import React from "react";

export default function FormSelect<T extends FieldValues>({
  form,
  name,
  label,
  selectItem,
  data,
  valueKey = "id",
  disabled = false,
  labelKey = "name",
  disabledKey,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  selectItem?: { value: string; label: string; disabled?: boolean }[];
  data?: any[];
  valueKey?: string;
  disabled?: boolean;
  labelKey?: string;
  disabledKey?: string;
}) {
  const selectItems = React.useMemo(() => {
    if (selectItem) {
      // Use static options if provided
      return selectItem;
    } else if (data) {
      // Transform dynamic data into SelectOption format
      return data.map((item) => ({
        value: item[valueKey].toString(),
        label: item[labelKey],
        disabled: disabledKey ? item[disabledKey] : false,
      }));
    }
    return [];
  }, [selectItem, data, valueKey, labelKey, disabledKey]);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, ...rest } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select {...rest} onValueChange={onChange} disabled={disabled}>
              <SelectTrigger
                className={cn("w-full", {
                  "border-red-500": form.formState.errors[name]?.message,
                })}
              >
                <SelectValue placeholder={`Select ${label}`}></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {selectItems.map((item) => (
                    <SelectItem
                      key={item.label}
                      value={item.value}
                      disabled={item.disabled}
                      className="capitalize"
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
      )}
    />
  );
}

"use client";

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
import { useEffect, useRef } from "react";

export default function FormSelect<T extends FieldValues>({
  form,
  name,
  label,
  selectItem,
  disabled = false,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  selectItem: { value: string; label: string; disabled?: boolean }[];
  disabled?: boolean;
}) {
  const mountedRef = useRef(false);
  const hasTriggeredOnChangeRef = useRef(false);

  useEffect(() => {
    // Mark as mounted after first render
    const timer = setTimeout(() => {
      mountedRef.current = true;
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              value={field.value || ""}
              onValueChange={(value) => {
                // Block first onChange if it's trying to clear a valid value
                if (!hasTriggeredOnChangeRef.current && field.value && !value) {
                  hasTriggeredOnChangeRef.current = true;
                  return;
                }

                hasTriggeredOnChangeRef.current = true;
                field.onChange(value);
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
                  {selectItem.map((item) => (
                    <SelectItem
                      key={item.value}
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

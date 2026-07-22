"use client";

import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Input } from "../../ui/input";
import { Calendar } from "../../ui/calendar";
import { formatDateLocal } from "@/lib/format-date";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Skeleton } from "../../ui/skeleton";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormDatePicker<T extends FieldValues>({
  form,
  label,
  name,
  className,
  isLoading,
  required,
  disabled,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  className?: string;
  isLoading?: boolean;
  required?: boolean;
  disabled?: boolean;
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
              <Skeleton className="h-10 w-full" />
            ) : (
              <Popover modal>
                <PopoverTrigger asChild>
                  <Input
                    value={field.value ?? ""}
                    placeholder="Select a date"
                    disabled={disabled}
                    // onChange={(e) =>
                    //   setValues((prev) => ({ ...prev, [value]: e.target.value }))
                    // }
                  />
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (!date) return;
                      field.onChange(formatDateLocal(date)); // kirim string
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

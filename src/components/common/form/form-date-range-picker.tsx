"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Skeleton } from "../../ui/skeleton";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import DateRangeInput from "../date-range-picker";

export default function FormDateRangePicker<T extends FieldValues>({
  form,
  label,
  name,
  className,
  isLoading,
  required,
  disabled,
  numberOfMonths = 2,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  className?: string;
  isLoading?: boolean;
  required?: boolean;
  disabled?: boolean;
  numberOfMonths?: number;
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
              <DateRangeInput
                value={field.value ?? ""}
                onChange={field.onChange}
                disabled={disabled}
                numberOfMonths={numberOfMonths}
              />
            )}
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Switch } from "../../ui/switch";
import { CircleQuestionMark } from "lucide-react";

export default function FormSwitch<T extends FieldValues>({
  form,
  label,
  name,
  disabled = false,
  className,
  defaultChecked = false,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  className?: string;
  defaultChecked?: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { ...rest } }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Switch
              {...rest}
              defaultChecked={defaultChecked}
              disabled={disabled}
              onCheckedChange={(e) => {
                rest.onChange(e);
              }}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

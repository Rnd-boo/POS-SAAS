import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Skeleton } from "../ui/skeleton";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "../ui/combobox";
export type comboboxType = {
  id: string;
  name: string;
};

export default function MultipleCombobox<T extends FieldValues>({
  form,
  label,
  name,
  items,
  disabled = false,
  isLoading,
  value,
  setValue,
}: {
  form: UseFormReturn<T>;
  label: string;
  name: Path<T>;
  items: comboboxType[];
  disabled?: boolean;
  isLoading?: boolean;
  value: comboboxType[];
  setValue: (value: comboboxType[]) => void;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Combobox
                  items={items}
                  multiple
                  value={value}
                  onValueChange={(newValue) => {
                    field.onChange(newValue);
                    setValue(newValue);
                  }}
                  itemToStringValue={(item) => item.name}
                  autoHighlight
                >
                  <ComboboxChips>
                    <ComboboxValue>
                      {value?.map((item) => (
                        <ComboboxChip key={item.id}>{item.name}</ComboboxChip>
                      ))}
                    </ComboboxValue>
                    <ComboboxChipsInput disabled={disabled} />
                  </ComboboxChips>
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.id} value={item}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        );
      }}
    />
  );
}

import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Skeleton } from "../../ui/skeleton";
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
  useComboboxAnchor,
} from "../../ui/combobox";
export type comboboxType = {
  id: string;
  name: string;
};

export default function FormMultipleCombobox<T extends FieldValues>({
  form,
  label,
  name,
  items,
  disabled = false,
  isLoading,
  value,
  setValue,
  required,
}: {
  form: UseFormReturn<T>;
  label: string;
  name: Path<T>;
  items: comboboxType[];
  disabled?: boolean;
  isLoading?: boolean;
  value: comboboxType[];
  setValue: (value: comboboxType[]) => void;
  required?: boolean;
}) {
  const anchor = useComboboxAnchor();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
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
                  <ComboboxChips ref={anchor}>
                    <ComboboxValue>
                      {value?.map((item) => (
                        <ComboboxChip key={item.id}>{item.name}</ComboboxChip>
                      ))}
                    </ComboboxValue>
                    <ComboboxChipsInput disabled={disabled} />
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
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

"use client";

import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo, useState } from "react";

export type MultiSelectComboboxItem = {
  value: string;
  label: string;
};

type MultiSelectComboboxProps = {
  items: MultiSelectComboboxItem[];
  values?: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
};

export function MultiSelectCombobox({
  items,
  values = [],
  onChange,
  placeholder = "Select items",
  searchPlaceholder = "Search...",
  disabled,
  className,
  onOpenChange,
  isLoading = false,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const selectedItems = useMemo(
    () => items.filter((i) => values?.includes(i.value)),
    [items, values],
  );

  const handleSelect = (itemValue: string) => {
    const newValues = values.includes(itemValue)
      ? values.filter((v) => v !== itemValue)
      : [...values, itemValue];
    onChange(newValues);
  };

  const handleRemove = (itemValue: string) => {
    onChange(values.filter((v) => v !== itemValue));
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full h-auto min-h-9 py-0 items-center justify-between",
            !selectedItems.length && "text-muted-foreground",
            className,
          )}
        >
          <span className="flex gap-1.5 flex-wrap w-full items-center">
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <span
                  key={item.value}
                  className="flex items-center gap-1 bg-muted text-secondary-foreground px-2 py-0.5 rounded-md text-sm"
                >
                  {item.label}
                  <X
                    className="h-3 w-3 opacity-50 hover:opacity-100 cursor-pointer !pointer-events-auto"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleRemove(item.value);
                    }}
                  />
                </span>
              ))
            ) : (
              <span>{placeholder}</span>
            )}
          </span>
          {selectedItems.length > 0 && (
            <X
              className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer shrink-0 ml-2 !pointer-events-auto"
              onMouseDown={(e) => {
                onChange([]);
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </span>
              ) : (
                "No results found."
              )}
            </CommandEmpty>

            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => handleSelect(item.value)}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      values.includes(item.value) ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

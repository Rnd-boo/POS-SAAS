import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";
import { Combobox } from "../manual-combobox";
import { FilterConfig } from "@/types/general";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  formatDateLocal,
  formatDisplayRange,
  parseRange,
} from "@/lib/format-date";

export default function DialogFilters({
  open,
  onOpenChange,
  configs,
  onChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configs?: FilterConfig[];
  onChange?: (filters: Record<string, string>) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleReset = () => {
    setValues({});
    onChange?.({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        {configs?.map((config) => (
          <div
            key={config.key}
            className=" grid grid-cols-[1fr_2fr] items-center gap-x-2"
          >
            <div className="text-end">{config.label} :</div>
            {config.type === "select" ? (
              <Select
                value={values[config.key] || ""}
                onValueChange={(value) =>
                  setValues({ ...values, [config.key]: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {config.options?.map((item) => (
                      <SelectItem
                        key={`${item.value}-${item.label}`}
                        value={item.value}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : config.type === "combobox" ? (
              <Combobox
                modal
                items={config.options || []}
                value={values[config.key] || ""}
                onChange={(value) =>
                  setValues({ ...values, [config.key]: value })
                }
              />
            ) : config.type === "date" ? (
              <Popover modal>
                <PopoverTrigger asChild>
                  <Input
                    value={
                      values[config.key]
                        ? formatDisplayRange(values[config.key])
                        : ""
                    }
                    onChange={(e) =>
                      setValues({ ...values, [config.key]: e.target.value })
                    }
                  />
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Calendar
                    mode="range"
                    numberOfMonths={2}
                    selected={
                      values[config.key]
                        ? parseRange(values[config.key])
                        : undefined
                    }
                    onSelect={(range) => {
                      if (!range?.from || !range?.to) return;

                      const formatted = `${formatDateLocal(range.from)}_${formatDateLocal(range.to)}`;

                      setValues((prev) => ({
                        ...prev,
                        [config.key]: formatted,
                      }));
                    }}
                    className="rounded-lg border"
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <Input
                value={values[config.key] ?? ""}
                onChange={(e) =>
                  setValues({ ...values, [config.key]: e.target.value })
                }
              />
            )}
          </div>
        ))}
        <DialogFooter className="!justify-between">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="cursor-pointer"
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="cursor-pointer"
            onClick={() => {
              onChange?.(values);
              onOpenChange(false);
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

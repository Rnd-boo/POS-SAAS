"use client";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import {
  formatDateLocal,
  formatDisplayRange,
  parseRange,
} from "@/lib/format-date";

export default function DateRangeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range?.from || !range?.to) return;
    onChange(`${formatDateLocal(range.from)}_${formatDateLocal(range.to)}`);
  };

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Input
          value={formatDisplayRange(value)}
          placeholder="Select a date"
          // onChange={(e) =>
          //   setValues((prev) => ({ ...prev, [value]: e.target.value }))
          // }
        />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={value ? parseRange(value) : undefined}
          onSelect={handleSelect}
          className="rounded-lg border"
        />
      </PopoverContent>
    </Popover>
  );
}

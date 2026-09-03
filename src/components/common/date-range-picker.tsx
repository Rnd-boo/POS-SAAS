"use client";

import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import {
  formatDateLocal,
  formatDisplayRange,
  parseRange,
} from "@/lib/format-date";
import { Button } from "../ui/button";

interface DateRangeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  numberOfMonths?: number;
}

export default function DateRangeInput({
  value,
  onChange,
  placeholder,
  disabled,
  numberOfMonths = 2,
}: DateRangeInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(() => formatDisplayRange(value));

  // Sync typed text when the value changes externally (calendar pick, reset, etc.)
  useEffect(() => {
    setInputValue(formatDisplayRange(value));
  }, [value]);

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range?.from) return;

    // still mid-pick (only "from" chosen) — keep popover open, don't commit yet
    if (!range.to) {
      onChange(`${formatDateLocal(range.from)}_${formatDateLocal(range.from)}`);
      return;
    }

    onChange(`${formatDateLocal(range.from)}_${formatDateLocal(range.to)}`);
  };

  const commitTypedValue = (text: string) => {
    const parsed = parseTypedRange(text);
    if (parsed) {
      onChange(`${formatDateLocal(parsed.from)}_${formatDateLocal(parsed.to)}`);
    } else {
      // invalid — revert to last valid value instead of accepting garbage
      setInputValue(formatDisplayRange(value));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          value={inputValue}
          placeholder="Select or type a date range"
          disabled={disabled}
          onChange={(e) => setInputValue(e.target.value)}
          onClick={(e) => {
            // stop Radix's built-in trigger toggle from also firing and
            // racing with our own setOpen(true) below
            e.preventDefault();
            if (!disabled) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitTypedValue(inputValue);
              setOpen(false);
            }
            if (e.key === "Escape") {
              setInputValue(formatDisplayRange(value));
              setOpen(false);
            }
          }}
          onBlur={() => commitTypedValue(inputValue)}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Calendar
          mode="range"
          numberOfMonths={numberOfMonths}
          selected={value ? parseRange(value) : undefined}
          onSelect={handleSelect}
          className="rounded-lg border"
        />
        <div className="flex justify-end p-2">
          <Button onClick={() => setOpen(false)}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Accepts things like:
//  "2024-01-01 - 2024-01-31"
//  "01/01/2024 - 01/31/2024"
//  "Jan 1, 2024 - Jan 31, 2024"
//  a single date -> treated as a one-day range
function parseTypedRange(text: string): { from: Date; to: Date } | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // require whitespace around the separator so "2024-01-01" itself
  // doesn't get split on its internal dashes
  const parts = trimmed.split(/\s+(?:-|to|–|—)\s+/i).filter(Boolean);

  if (parts.length === 1) {
    const d = parseSingleDate(parts[0]);
    return d ? { from: d, to: d } : null;
  }

  if (parts.length >= 2) {
    const from = parseSingleDate(parts[0]);
    const to = parseSingleDate(parts[parts.length - 1]);
    if (!from || !to) return null;
    return from > to ? { from: to, to: from } : { from, to };
  }

  return null;
}

function parseSingleDate(text: string): Date | null {
  const value = text.trim();

  // yyyy-MM-dd
  let match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, y, m, d] = match;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  // MM/dd/yyyy
  match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [, m, d, y] = match;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  // fallback to native parsing, e.g. "Jan 1, 2024"
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

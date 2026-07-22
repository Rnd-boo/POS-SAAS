import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";

export function SortableHeader<T>({
  column,
  label,
}: {
  column: Column<T, unknown>;
  label: string;
}) {
  const sorted = column.getIsSorted();
  return (
    <div
      className="flex gap-2 font-medium items-center cursor-pointer"
      onClick={() => column.toggleSorting(undefined, true)}
    >
      {label}
      {sorted === "asc" && <ArrowUp className="size-3" />}
      {sorted === "desc" && <ArrowDown className="size-3" />}
    </div>
  );
}

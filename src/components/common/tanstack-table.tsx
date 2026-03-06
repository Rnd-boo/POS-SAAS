"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationDataTable from "./pagination-data-table";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DataTable<TData extends { id: string | number }>({
  columns,
  data,
  totalPages,
  currentPage,
  onChangePage,
  totalData,
  onSortingChange,
  sorting,
  refetch,
  pathname,
  onRowClick,
  setSelectedAction,
  isLoading,
}: {
  columns: ColumnDef<TData>[];
  data: TData[];
  totalPages: number;
  currentPage: number;
  onChangePage: (page: number) => void;
  totalData: number;
  onSortingChange?: OnChangeFn<SortingState>;
  sorting?: SortingState;
  refetch: () => void;
  pathname?: string;
  onRowClick?: (data: TData) => void;
  setSelectedAction?: React.Dispatch<
    React.SetStateAction<{
      data: TData;
      type: "detail" | "update" | "delete";
    } | null>
  >;
  isLoading?: boolean;
}) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    onSortingChange: onSortingChange,
    enableMultiSort: false,
    manualSorting: true,
    onColumnFiltersChange: setColumnFilters,
    enableColumnPinning: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnPinning: {
        left: ["name"],
        right: ["actions"],
      },
    },
  });
  const copyValue = React.useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(String(value));
      toast.success(`Copied: "${value}"`);
    } catch {
      toast.error("Copy failed");
    }
  }, []);
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:!bg-muted/50 bg-muted/50 ">
              <TableCell colSpan={columns.length}>
                <div className="flex justify-end w-full">
                  {table.getAllColumns().filter((column) => column.getCanHide())
                    .length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="mr-auto">
                          Columns <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {table
                          .getAllColumns()
                          .filter((column) => column.getCanHide())
                          .map((column) => (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Button
                    size="icon"
                    onClick={() => refetch()}
                    variant="outline"
                  >
                    <RefreshCcw />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "bg-muted hover:!bg-muted/50 cursor-pointer transition-all",
                        header.column.getIsPinned() && "sticky z-20",
                        header.column.id === "actions" &&
                          "hover:!bg-muted cursor-default",
                      )}
                      style={{
                        left:
                          header.column.getIsPinned() === "left"
                            ? header.column.getStart("left")
                            : undefined,
                        right:
                          header.column.getIsPinned() === "right"
                            ? header.column.getAfter("right")
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => {
                  if (onRowClick) {
                    onRowClick(row.original);
                  } else if (pathname) {
                    router.push(`${pathname}/${row.original.id}`);
                  } else {
                    setSelectedAction?.({
                      data: row.original,
                      type: "detail",
                    });
                  }
                }}
                className={cn(
                  (pathname || setSelectedAction) && "cursor-pointer",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      cell.column.getIsPinned() && "sticky z-20 ",
                      cell.column.getIsPinned() === "right" &&
                        cell.column.id === "actions" &&
                        "text-center",
                    )}
                    style={{
                      left:
                        cell.column.getIsPinned() === "left"
                          ? cell.column.getStart("left")
                          : undefined,
                      right:
                        cell.column.getIsPinned() === "right"
                          ? cell.column.getAfter("right")
                          : undefined,
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const rawValue = cell.getValue();
                      const value =
                        rawValue !== null &&
                        rawValue !== undefined &&
                        typeof rawValue === "object"
                          ? String(
                              (rawValue as Record<string, unknown>).name ??
                                JSON.stringify(rawValue),
                            )
                          : String(rawValue ?? "");
                      copyValue(value);
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {table.getRowModel().rows?.length === 0 && !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Showing {table.getRowModel().rows.length} of {totalData} row(s).
        </div>
        {totalPages > 1 && (
          <div className="flex justify-end">
            <PaginationDataTable
              totalPages={totalPages}
              onChangePage={onChangePage}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

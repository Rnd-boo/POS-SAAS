"use client";

import DropdownAction from "@/components/common/dropdown-action";
import { StockAdjustment } from "@/validations/inventory/stock-adjustment.validation";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  Pencil,
  SquareCheckBig,
  Trash2,
} from "lucide-react";

type StockAdjustmentColumnsParams = {
  router: {
    push: (path: string) => void;
  };
  pathname: string;
  setSelectedAction: (
    value: { data: StockAdjustment; type: "delete" } | null,
  ) => void;
};

export function getStockAdjustmentColumns({
  router,
  pathname,
  setSelectedAction,
}: StockAdjustmentColumnsParams): ColumnDef<StockAdjustment>[] {
  return [
    {
      accessorKey: "id",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Adjustment ID
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "stock_adjustment_date",
      enableHiding: false,
      header: () => <div>Adjustment Date</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {row.getValue("stock_adjustment_date")}
        </div>
      ),
    },
    {
      accessorKey: "branch",
      enableHiding: false,
      header: () => <div>Branch</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {(row.getValue("branch") as { name: string }).name}
        </div>
      ),
    },
    {
      accessorKey: "branch_location",
      enableHiding: false,
      header: () => <div>Location</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {(row.getValue("branch_location") as { name: string }).name}
        </div>
      ),
    },
    {
      accessorKey: "status",
      enableHiding: false,
      header: () => <div className="!cursor-default">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="truncate max-w-xs capitalize">
            {row.getValue("status")}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="flex justify-center">Actions</div>,
      cell: ({ row }) => {
        const menu: {
          label?: React.ReactNode;
          variant?: "destructive" | "default";
          action?: () => void;
          separator?: boolean;
        }[] = [
          {
            label: (
              <span className="flex items-center gap-2">
                <Trash2 className="text-red-400" />
                Delete
              </span>
            ),
            variant: "destructive",
            action: () => {
              setSelectedAction({
                data: row.original,
                type: "delete",
              });
            },
          },
        ];
        const status = row.getValue("status");
        if (status !== "authorized" && status !== "rejected") {
          menu.unshift(
            {
              label: (
                <span className="flex items-center gap-2">
                  <SquareCheckBig />
                  Create SA
                </span>
              ),
              action: () => {
                router.push(`${pathname}/create/${row?.original.id}`);
              },
            },
            { separator: true },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Pencil />
                  Edit
                </span>
              ),
              action: () => {
                router.push(`${pathname}/${row?.original.id}/edit`);
              },
            },
          );
        }
        return <DropdownAction menu={menu} />;
      },
    },
  ];
}

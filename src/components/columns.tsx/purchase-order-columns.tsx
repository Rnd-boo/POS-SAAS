"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PurchaseOrderData } from "@/types/purchasing/purchase-order";
import { SortableHeader } from "../common/table-sortable-header";

export const purchaseOrderColumns: ColumnDef<PurchaseOrderData>[] = [
  {
    id: "id",
    accessorFn: (row) => row.id,
    enableHiding: false,
    header: ({ column }) => (
      <SortableHeader column={column} label="Purchase Order ID" />
    ),
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "Purchase Order Date",
    accessorFn: (row) => row.purchase_order_date,
    enableHiding: false,
    header: ({ column }) => (
      <SortableHeader column={column} label="Purchase Order Date" />
    ),
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "Required Date",
    accessorFn: (row) => row.required_date,
    enableHiding: false,
    header: ({ column }) => (
      <SortableHeader column={column} label="Required Date" />
    ),
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "branch",
    enableSorting: false,
    accessorFn: (row) => row.branch.name,
    enableHiding: false,
    header: () => <div className="cursor-default">Branch</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "supplier",
    enableSorting: false,
    accessorFn: (row) => row.suppliers.name,
    enableHiding: false,
    header: () => <div className="cursor-default">Supplier Name</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    accessorKey: "status",
    enableHiding: false,
    header: ({ column }) => <SortableHeader column={column} label="Status" />,
    cell: ({ row }) => {
      return (
        <div className="truncate max-w-xs capitalize">
          {row.getValue("status")}
        </div>
      );
    },
  },
];

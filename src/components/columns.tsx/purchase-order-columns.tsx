"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PurchaseOrderData } from "@/types/purchasing/purchase-order";

export const purchaseOrderColumns: ColumnDef<PurchaseOrderData>[] = [
  {
    id: "id",
    accessorFn: (row) => row.id,
    enableHiding: false,
    header: () => <div className="cursor-default ">Purchase Order ID</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "Purchase Order Date",
    accessorFn: (row) => row.purchase_order_date,
    header: () => <div className="cursor-default">Purchase Order Date</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "Required Date",
    accessorFn: (row) => row.required_date,
    header: () => <div className="cursor-default">Required Date</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "branch",
    accessorFn: (row) => row.branch.name,
    enableHiding: false,
    header: () => <div className="cursor-default">Branch</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "supplier",
    accessorFn: (row) => row.suppliers.name,
    enableHiding: false,
    header: () => <div className="cursor-default">Supplier</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
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
];

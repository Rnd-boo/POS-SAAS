"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StockMovement } from "@/types/inventory/stock-movement";
import Link from "next/link";

export const stockOverviewColumns = (
  currentPage = 1,
): ColumnDef<StockMovement>[] => [
  {
    id: "number",
    enableHiding: false,
    header: () => <div>#</div>,
    cell: ({ row }) => (
      <div>
        {row.original.isPrevious ? "" : (currentPage - 1) * 20 + row.index}
      </div>
    ),
  },
  {
    id: "products(name)",
    accessorFn: (row) => row.products.name,
    enableHiding: false,
    header: () => <div>Product Name</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "products(upc)",
    accessorFn: (row) => row.products.upc,
    enableHiding: false,
    header: () => <div>Product Code</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "units(name)",
    accessorFn: (row) => row.product_units.units.name,
    enableHiding: false,
    header: () => <div>Unit</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    accessorKey: "movement_date",
    enableHiding: false,
    header: () => <div>Movement Date</div>,
    cell: ({ row }) => <div>{row.getValue("movement_date")}</div>,
  },
  {
    id: "branch_location(name)",
    accessorFn: (row) => row.branch_location.name,
    enableHiding: false,
    header: () => <div>Location</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    accessorKey: "reference_type",
    enableHiding: false,
    header: () => <div>Reference Type</div>,
    cell: ({ row }) => <div>{row.getValue("reference_type")}</div>,
  },
  {
    id: "reference_id",
    accessorFn: (row) => row.reference_id,
    enableHiding: false,
    header: () => <div>Reference ID</div>,
    cell: ({ row, getValue }) => {
      if (row.original.isPrevious) return <div />;
      const prefix = getValue<string>().slice(0, 2);
      let link = "";
      switch (prefix) {
        case "OM":
          link = `/production/open-manufacturing/${getValue<string>()}`;
          break;
        case "SA":
          link = `/inventory/stock-adjustment/${getValue<string>()}`;
          break;
        default:
          link = `/unauthorized/${getValue<string>()}`;
      }
      return (
        <Link href={link} className="text-blue-300 hover:underline">
          {getValue<string>()}
        </Link>
      );
    },
  },
  {
    id: "in_qty",
    accessorFn: (row) => (row.direction === "IN" ? row.qty_base : 0),
    enableHiding: false,
    header: () => <div>In Qty</div>,
    cell: ({ row, getValue }) => (
      <div className="truncate max-w-xs">
        {row.original.isPrevious ? "-" : getValue<number>()}
      </div>
    ),
  },
  {
    id: "out_qty",
    accessorFn: (row) => (row.direction === "OUT" ? row.qty_base : 0),
    enableHiding: false,
    header: () => <div>Out Qty</div>,
    cell: ({ row, getValue }) => (
      <div className="truncate max-w-xs">
        {row.original.isPrevious ? "-" : getValue<number>()}
      </div>
    ),
  },
  {
    id: "balance",
    accessorFn: (row) => row.balance,
    enableHiding: false,
    header: () => <div>Balance</div>,
    footer: () => <div>Total</div>,
    cell: ({ getValue }) => (
      <div className="truncate max-w-xs">{getValue<number>()}</div>
    ),
  },
];

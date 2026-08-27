"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ProductStock } from "@/types/inventory/stock-list";

const STOCK_PAGE_SIZE = 10;

export const stockListColumns = (
  currentPage = 1,
): ColumnDef<ProductStock>[] => [
  {
    id: "number",
    enableHiding: false,
    header: () => <div className="cursor-default ">No.</div>,
    cell: ({ row }) => (
      <div>{(currentPage - 1) * STOCK_PAGE_SIZE + row.index + 1}</div>
    ),
  },
  {
    id: "branch_location(name)",
    accessorFn: (row) => row.branch_location.name,
    header: () => <div className="cursor-default">Location</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "name",
    accessorFn: (row) => row.products.name,
    enableHiding: false,
    header: () => <div className="cursor-default">Product Name</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "products(upc)",
    accessorFn: (row) => row.products.upc,
    enableHiding: false,
    header: () => <div className="cursor-default">Product Code</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "category",
    accessorFn: (row) => row.products.categories.name,
    enableHiding: false,
    header: () => <div className="cursor-default">Category</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "units",
    accessorFn: (row) => row.products.product_units[0].units.name,
    enableHiding: false,
    header: () => <div className="cursor-default">Base Unit</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "status",
    accessorFn: (row) => row.products.status,
    enableHiding: false,
    header: () => <div className="cursor-default">Status</div>,
    cell: ({ getValue }) => {
      const status = getValue();

      return (
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            status ? "bg-green-600" : "bg-red-500",
          )}
        >
          {status ? "Active" : "Inactive"}
        </div>
      );
    },
  },
  {
    accessorKey: "on_hand",
    enableHiding: false,
    header: () => <div className="cursor-default">Stock</div>,
    cell: ({ row }) => <div>{row.getValue("on_hand")}</div>,
  },
];

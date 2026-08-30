"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UnitProduct } from "@/types/products/product-dialog";
import { SortableHeader } from "../common/table-sortable-header";

export const productUnitColumns: ColumnDef<UnitProduct>[] = [
  {
    id: "products(name)",
    accessorFn: (row) => row.products.name,
    enableHiding: false,
    header: ({ column }) => (
      <SortableHeader column={column} label="Product Name" />
    ),
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "categories",
    accessorFn: (row) => (row.products?.categories as { name?: string }).name,
    enableHiding: false,
    header: () => <div>Category</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "products(upc)",
    accessorFn: (row) => row.products.upc,
    enableHiding: false,
    header: ({ column }) => (
      <SortableHeader column={column} label="Product Code" />
    ),
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "units(name)",
    accessorFn: (row) => row.units.name,
    enableHiding: false,
    header: ({ column }) => <SortableHeader column={column} label="Unit" />,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "on_hand",
    accessorKey: "on_hand",
    enableHiding: false,
    header: () => <div>Stock</div>,
    cell: ({ row }) => <div>{row.getValue("on_hand") ?? 0}</div>,
  },
];

export function getProductUnitColumnsWithAction(
  onSelect: (row: UnitProduct) => void,
): ColumnDef<UnitProduct>[] {
  return [
    ...productUnitColumns,
    {
      id: "action",
      enableHiding: false,
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <button
            type="button"
            className="text-sm text-primary hover:underline"
            onClick={() => onSelect(row.original)}
          >
            Pilih
          </button>
        </div>
      ),
    },
  ];
}

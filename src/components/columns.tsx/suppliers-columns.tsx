import { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "../common/table-sortable-header";
import { cn } from "@/lib/utils";
import DropdownAction from "../common/dropdown-action";
import { Pencil, Trash2 } from "lucide-react";
import { SupplierData } from "@/types/supplier";

export const supplierColumns = ({
  router,
  setSelectedAction,
  pathname,
}: {
  router: {
    push: (path: string) => void;
  };
  setSelectedAction: (
    value: { data: SupplierData; type: "delete" } | null,
  ) => void;
  pathname: string;
}): ColumnDef<SupplierData>[] => [
  {
    accessorKey: "name",
    enableHiding: false,
    header: ({ column }) => (
      <SortableHeader column={column} label="Supplier Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    id: "supplier_pic.name",
    enableHiding: false,
    enableSorting: false,
    accessorFn: (row) => row.supplier_pic?.[0]?.name,
    header: () => <div className="cursor-default">Contact Name</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    accessorKey: "address",
    header: ({ column }) => <SortableHeader column={column} label="Address" />,
    cell: ({ row }) => <div>{row.getValue("address")}</div>,
  },
  {
    accessorKey: "credit_terms",
    enableHiding: false,
    header: ({ column }) => (
      <SortableHeader column={column} label="Credit Terms (days)" />
    ),
    cell: ({ row }) => <div>{row.getValue("credit_terms")}</div>,
  },
  {
    accessorKey: "notes",
    header: ({ column }) => <SortableHeader column={column} label="Notes" />,
    cell: ({ row }) => <div>{row.getValue("notes")}</div>,
  },
  {
    accessorKey: "status",
    enableHiding: false,
    enableSorting: false,
    header: () => <div>Status</div>,
    cell: ({ row }) => (
      <div
        className={cn(
          "w-fit rounded-full px-2 py-1 text-white",
          row.getValue("status") ? "bg-green-600" : "bg-red-500",
        )}
      >
        {row.getValue("status") ? "Active" : "Inactive"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="flex justify-center">Actions</div>,
    cell: ({ row }) => {
      return (
        <DropdownAction
          menu={[
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
          ]}
        />
      );
    },
  },
];

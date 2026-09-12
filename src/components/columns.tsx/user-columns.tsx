"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { User } from "@/validations/user/user.validation";
import DropdownAction from "../common/dropdown-action";
import { Pencil, Trash2 } from "lucide-react";

export type UserColumn = {
  id: string;
  name: string;
  username: string;
  password_hash: string;
  status: boolean;
  roles: { name: string };
  brand_id?: string | undefined;
};

export const userColumns: ColumnDef<UserColumn>[] = [
  {
    id: "name",
    accessorFn: (row) => row.name,
    enableHiding: false,
    header: () => <div className="cursor-default">Name</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "roles(name)",
    enableHiding: false,
    accessorFn: (row) => row.roles.name,
    header: () => <div className="cursor-default">Role</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "username",
    accessorFn: (row) => row.username,
    header: () => <div className="cursor-default">Username</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    accessorKey: "status",
    enableHiding: false,
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status");

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
              // action: () => {
              //   setSelectedAction({
              //     data: row.original,
              //     type: "update",
              //   });
              // },
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash2 className="text-red-400" />
                  Delete
                </span>
              ),
              variant: "destructive",
              // action: () => {
              //   setSelectedAction({
              //     data: row.original,
              //     type: "delete",
              //   });
              // },
            },
          ]}
        />
      );
    },
  },
];

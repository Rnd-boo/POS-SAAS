"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import DropdownAction from "../common/dropdown-action";
import { Pencil, Trash2 } from "lucide-react";
import { User } from "@/validations/user/user.validation";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export type UserColumn = {
  id: string;
  name: string;
  username: string;
  password_hash: string;
  status: boolean;
  roles_id: string;
  client_branches: { branch: { name: string } }[];
  roles: { name: string };
  brand_id?: string | undefined;
};

export const userColumns = ({
  router,
  setSelectedAction,
  pathname,
}: {
  router: {
    push: (path: string) => void;
  };
  setSelectedAction: (value: { data: User; type: "delete" } | null) => void;
  pathname: string;
}): ColumnDef<UserColumn>[] => [
  {
    id: "name",
    accessorFn: (row) => row.name,
    enableHiding: false,
    header: () => <div className="cursor-default">Name</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "username",
    accessorFn: (row) => row.username,
    enableHiding: false,
    header: () => <div className="cursor-default">Username</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: "roles(name)",
    enableHiding: false,
    accessorFn: (row) => row.roles.name,
    header: () => <div className="cursor-default">Role</div>,
    cell: ({ getValue, row }) => (
      <Link
        href={`user/role/${row.original.roles_id}`}
        className="text-primary hover:text-foreground"
      >
        {getValue<string>()}
      </Link>
    ),
  },
  {
    id: "branch",
    accessorFn: (row) =>
      row.client_branches.map(({ branch }) => branch.name).join(", "),
    enableHiding: false,
    header: () => <div>Branch Access</div>,
    cell: ({ getValue, row }) => {
      return row.original.client_branches.length > 1 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-fit truncate whitespace-nowrap cursor-pointer text-primary hover:text-foreground">
              {row.original.client_branches[0].branch.name} ..
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getValue<string>()}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="truncate max-w-xs">{getValue<string>()}</div>
      );
    },
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

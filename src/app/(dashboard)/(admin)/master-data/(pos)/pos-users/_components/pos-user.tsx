"use client";

import DropdownAction from "@/components/common/dropdown-action";
import PageHeader from "@/components/common/page-header";
import { DataTable } from "@/components/common/tanstack-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import {
  POSUserBranches,
  POSUsers,
} from "@/validations/pos/pos-users.validation";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function POSUser() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const router = useRouter();
  const pathname = usePathname();

  const {
    currentPage,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
    setTotalData,
    totalData,
  } = useDataTable();

  const {
    data: POSUserBranches,
    isLoading: isLoadingPOSUserBranches,
    refetch,
  } = useQuery({
    queryKey: ["pos_user_branches", currentPage, currentSearch],

    queryFn: async () => {
      const result = await supabase
        .from("pos_user_branches")
        .select(
          `id, pos_users_id,
            pos_users!inner(name, username, status), 
            branch!inner(name)`,
          { count: "exact" },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .order("pos_users(name)")
        .ilike("pos_users.name", `%${currentSearch}%`)
        .range((currentPage - 1) * 10, currentPage * 10 - 1);
      if (result.error)
        toast.error("Get POS Users Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: GroupedPOSUser;
    type: "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const handleClickAction = (type: string) => {
    router.push(`${pathname}/${type}`);
  };

  interface GroupedPOSUser extends Omit<POSUserBranches, "branch"> {
    branch: string[];
  }
  const grouped = Array.from(
    (POSUserBranches?.data ?? [])
      .reduce<Map<number, GroupedPOSUser>>((map, item) => {
        if (!map.has(item.pos_users_id)) {
          map.set(item.pos_users_id, {
            ...item,
            branch: [(item.branch as unknown as { name: string }).name],
          });
        } else {
          map
            .get(item.pos_users_id)!
            .branch.push((item.branch as unknown as { name: string }).name);
        }
        return map;
      }, new Map())
      .values(),
  );
  useEffect(() => {
    setTotalData(grouped.length || 0);
  }, [grouped]);

  const data: GroupedPOSUser[] = grouped || [];
  const columns: ColumnDef<GroupedPOSUser>[] = [
    {
      accessorKey: "pos_users",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            POS Name
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => (
        <div>{(row.getValue("pos_users") as { name: string })?.name}</div>
      ),
    },
    {
      accessorKey: "username",
      enableHiding: false,
      header: () => <div>Username</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {(row.getValue("pos_users") as { username: string }).username}
        </div>
      ),
    },
    {
      accessorKey: "branch",
      enableHiding: false,
      maxSize: 200,
      header: () => <div>Branch Access</div>,
      cell: ({ row }) => {
        const branch = row.original.branch;
        return branch.length > 1 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-fit truncate whitespace-nowrap cursor-pointer text-primary hover:text-foreground">
                {branch[0]} ..
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{branch.join(", ")}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="truncate max-w-xs">{branch}</div>
        );
      },
    },
    {
      accessorKey: "status",
      enableHiding: false,
      header: () => <div>Status</div>,
      cell: ({ row }) => {
        const status = (row.getValue("pos_users") as { status: boolean })
          .status;

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
                  handleClickAction(`${row?.original.id}/edit`);
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

  const totalPages = useMemo(() => {
    return POSUserBranches && POSUserBranches.count !== null
      ? Math.ceil(POSUserBranches.count / 10)
      : 0;
  }, [POSUserBranches]);

  return (
    <div className="w-full">
      <PageHeader handleChangeSearch={handleChangeSearch} title="POS user" />
      <DataTable
        data={data}
        columns={columns}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        refetch={refetch}
        totalData={totalData}
        totalPages={totalPages}
      />
    </div>
  );
}

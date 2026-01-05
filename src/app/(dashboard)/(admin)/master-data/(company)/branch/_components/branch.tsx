"use client";

import { Button } from "@/components/ui/button";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Pencil, SearchIcon, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { Branch } from "@/validations/branch.validation";
import DialogDeleteBranch from "./dialog-delete-branch";
import { useBrandStore } from "@/stores/brand-store";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import DropdownAction from "@/components/common/dropdown-action";
import { DataTable } from "@/components/common/tanstack-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function BranchManagement() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentLimit,
    currentPage,
    handleChangeLimit,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
    totalData,
    setTotalData,
  } = useDataTable();

  const {
    data: branches,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "branch",
      currentPage,
      currentLimit,
      currentSearch,
      currentId,
      currentBrandId,
    ],
    queryFn: async () => {
      const result = await supabase
        .from("branch")
        .select("*,client_profiles:client_profiles_id(name),brand(name)", {
          count: "exact",
        })
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("name")
        .ilike("name", `%${currentSearch}%`);

      setTotalData(result.count || 0);
      if (result.error)
        toast.error("Get Branch Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Branch;
    type: "detail" | "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };
  const handleClickAction = (type: string) => {
    router.push(`${pathname}/${type}`);
  };

  const data: Branch[] = branches?.data || [];
  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: "name",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Branch Name
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "brand",
      enableHiding: false,
      header: () => <div>Brand</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {row.getValue("brand") !== null
            ? (row.getValue("brand") as unknown as { name: string }).name
            : "-"}
        </div>
      ),
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
              status ? "bg-green-600" : "bg-red-500"
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
    return branches && branches.count !== null
      ? Math.ceil(branches.count / currentLimit)
      : 0;
  }, [branches]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-semibold">Product Management</h1>
      </div>
      <div className="mb-2 flex justify-between ">
        <div className="flex gap-2 w-full max-w-md">
          <InputGroup className="max-w-sm">
            <InputGroupInput
              placeholder="Search by Branch name"
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <Link href={`${pathname}/create`}>
          <Button variant="outline">Create</Button>
        </Link>
      </div>
      <DataTable
        data={data}
        columns={columns}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalData={totalData}
        // sorting={sorting}
        // onSortingChange={setSorting}
        refetch={refetch}
        pathname={pathname}
      />
      <DialogDeleteBranch
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}

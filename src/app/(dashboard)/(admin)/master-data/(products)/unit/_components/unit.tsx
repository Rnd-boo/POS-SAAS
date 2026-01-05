"use client";

import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Pencil, SearchIcon, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Unit } from "@/validations/unit-validation";
import DialogCreateUnit from "./dialog-create-unit";
import DialogUpdateUnit from "./dialog-update-unit";
import DialogDeleteUnit from "./dialog-delete-unit";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/tanstack-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function UnitManagement() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
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
    data: units,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["units", currentPage, currentLimit, currentSearch, currentId],
    queryFn: async () => {
      const result = await supabase
        .from("units")
        .select("id, name, notes, status", { count: "exact" })
        .eq("clients_id", currentId)
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at")
        .ilike("name", `%${currentSearch}%`);

      setTotalData(result.count || 0);
      if (result.error)
        toast.error("Get Unit Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Unit;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const data: Unit[] = units?.data || [];
  const columns: ColumnDef<Unit>[] = [
    {
      accessorKey: "name",
      enableHiding: false,
      header: ({ column }) => {
        return (
          <div className="flex gap-2 font-medium items-center">Unit Name</div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "notes",
      enableHiding: false,
      header: () => <div>Notes</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {row.getValue("notes") !== null ? row.getValue("notes") : "-"}
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
                  setSelectedAction({
                    data: row.original,
                    type: "update",
                  });
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
    return units && units.count !== null
      ? Math.ceil(units.count / currentLimit)
      : 0;
  }, [units]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-semibold">Unit Of Measure Management</h1>
      </div>
      <div className="mb-2 flex justify-between">
        <div className="flex gap-2 w-full max-w-md">
          <InputGroup className="max-w-sm">
            <InputGroupInput
              placeholder="Search by unit name"
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create</Button>
          </DialogTrigger>
          <DialogCreateUnit refetch={refetch} />
        </Dialog>
      </div>
      <DataTable
        data={data}
        columns={columns}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalData={totalData}
        refetch={refetch}
      />
      <DialogUpdateUnit
        open={selectedAction !== null && selectedAction.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteUnit
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}

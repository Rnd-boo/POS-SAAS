"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Unit } from "@/validations/unit-validation";
import { HEADER_TABLE_UNIT } from "@/constants/unit.constant";
import DialogCreateUnit from "./dialog-create-unit";
import DialogUpdateUnit from "./dialog-update-unit";
import DialogDeleteUnit from "./dialog-delete-unit";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

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

  const filteredData = useMemo(() => {
    return (units?.data || []).map((unit, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        unit.name,
        unit.notes,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            unit.status ? "bg-green-600" : "bg-red-500"
          )}
        >
          {unit.status ? "Active" : "Not Active"}
        </div>,
        <div className="flex gap-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-6 hover:text-muted-foreground hover:!bg-muted-foreground/40"
            onClick={() => {
              setSelectedAction({
                data: unit,
                type: "update",
              });
            }}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-6 text-destructive hover:text-muted-foreground hover:!bg-muted-foreground/40"
            onClick={() => {
              setSelectedAction({
                data: unit,
                type: "delete",
              });
            }}
          >
            <Trash2 />
          </Button>
        </div>,
      ];
    });
  }, [units]);

  const totalPages = useMemo(() => {
    return units && units.count !== null
      ? Math.ceil(units.count / currentLimit)
      : 0;
  }, [units]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1>Category Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by Unit name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogCreateUnit refetch={refetch} />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_UNIT}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
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

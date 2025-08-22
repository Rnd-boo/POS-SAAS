"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_CATEGORY } from "@/constants/category.constant";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
// import DialogCreateCategory from "./dialog-create-category";
// import DialogUpdateCategory from "./dialog-update-category";
import { Category } from "@/validations/category-validation";
import { Unit } from "@/validations/unit-validation";
import { HEADER_TABLE_UNIT } from "@/constants/unit.constant";
import DialogCreateUnit from "./dialog-create-category";
// import DialogDeleteCategory from "./dialog-delete-category";

export default function UnitManagement() {
  const supabase = createClient();

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
    queryKey: ["units", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const result = await supabase
        .from("units")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at")
        .ilike("name", `%${currentSearch}%`);

      if (result.error)
        toast.error("Get Unit Data Failed", {
          description: result.error.message,
        });

      return result;
    },
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
                  data: unit,
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
                  data: unit,
                  type: "delete",
                });
              },
            },
          ]}
        />,
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
      {/* <DialogUpdateCategory
        open={selectedAction !== null && selectedAction.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteCategory
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      /> */}
    </div>
  );
}

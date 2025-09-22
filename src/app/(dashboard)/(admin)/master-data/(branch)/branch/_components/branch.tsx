"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Eye, Pencil, SquarePen, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { Branch } from "@/validations/branch.validation";
import { HEADER_TABLE_BRANCH } from "@/constants/branch.constant";

export default function BranchManagement() {
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
    data: branch,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["branch", currentPage, currentLimit, currentSearch, currentId],
    queryFn: async () => {
      const result = await supabase
        .from("branch")
        .select("*", { count: "exact" })
        .eq("clients_id", currentId)
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("name")
        .ilike("name", `%${currentSearch}%`);

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

  const filteredData = useMemo(() => {
    return (branch?.data || []).map((branch, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        branch.name,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            branch.status ? "bg-green-600" : "bg-red-500"
          )}
        >
          {branch.status ? "Active" : "Not Active"}
        </div>,
        <div className="flex items-center max-w-[40px] gap-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-4 hover:text-muted-foreground"
            onClick={() => {
              setSelectedAction({
                data: branch,
                type: "detail",
              });
            }}
          >
            <Eye />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-4 hover:text-muted-foreground"
            onClick={() => {
              setSelectedAction({
                data: branch,
                type: "update",
              });
            }}
          >
            <SquarePen />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-4 text-destructive hover:text-muted-foreground"
            onClick={() => {
              setSelectedAction({
                data: branch,
                type: "delete",
              });
            }}
          >
            <Trash2 />
          </Button>
        </div>,
      ];
    });
  }, [branch]);

  const totalPages = useMemo(() => {
    return branch && branch.count !== null
      ? Math.ceil(branch.count / currentLimit)
      : 0;
  }, [branch]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-xl font-semibold">Branch Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by branch name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            {/* <DialogCreateCategory refetch={refetch} /> */}
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_BRANCH}
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

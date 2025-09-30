"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { Branch } from "@/validations/branch.validation";
import { HEADER_TABLE_BRANCH } from "@/constants/branch.constant";
import DialogDetailBranch from "./dialog-detail-branch";
import DialogDeleteBranch from "./dialog-delete-branch";
import DialogCreateBranch from "./dialog-create-branch";
import DialogUpdateBranch from "./dialog-update-branch";
import { useBrandStore } from "@/stores/brand-store";

export default function BranchManagement() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
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
    return (branches?.data || []).map((branch, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        branch.name,
        (branch.brand as unknown as { name: string }).name,
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
  }, [branches]);

  const totalPages = useMemo(() => {
    return branches && branches.count !== null
      ? Math.ceil(branches.count / currentLimit)
      : 0;
  }, [branches]);

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
            <DialogCreateBranch refetch={refetch} />
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
      <DialogDetailBranch
        open={selectedAction !== null && selectedAction.type === "detail"}
        handleChangeAction={handleChangeAction}
        informationData={[
          {
            label: "Created By",
            value: (
              selectedAction?.data?.client_profiles as unknown as {
                name: string;
              }
            )?.name,
          },
          {
            label: "Created At",
            value: selectedAction?.data?.created_at,
          },
          {
            label: "Updated At",
            value: selectedAction?.data?.updated_at,
          },
        ]}
      />
      <DialogDeleteBranch
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogUpdateBranch
        open={selectedAction !== null && selectedAction.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}

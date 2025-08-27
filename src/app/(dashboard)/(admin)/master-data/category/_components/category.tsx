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
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import DialogCreateCategory from "./dialog-create-category";
import DialogUpdateCategory from "./dialog-update-category";
import { Category } from "@/validations/category-validation";
import DialogDeleteCategory from "./dialog-delete-category";
import { useAuthStore } from "@/stores/auth-store";

export default function CategoryManagement() {
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
    data: categories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "categories",
      currentPage,
      currentLimit,
      currentSearch,
      currentId,
    ],
    queryFn: async () => {
      const result = await supabase
        .from("categories")
        .select("id, name, description, status", { count: "exact" })
        .eq("clients_id", currentId)
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("name")
        .ilike("name", `%${currentSearch}%`);

      if (result.error)
        toast.error("Get Category Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Category;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const filteredData = useMemo(() => {
    return (categories?.data || []).map((category, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        category.name,
        <span className="block truncate max-w-xs">{category.description}</span>,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            category.status ? "bg-green-600" : "bg-red-500"
          )}
        >
          {category.status ? "Active" : "Not Active"}
        </div>,
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
                  data: category,
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
                  data: category,
                  type: "delete",
                });
              },
            },
          ]}
        />,
      ];
    });
  }, [categories]);

  const totalPages = useMemo(() => {
    return categories && categories.count !== null
      ? Math.ceil(categories.count / currentLimit)
      : 0;
  }, [categories]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-xl font-semibold">Category Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by category name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogCreateCategory refetch={refetch} />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_CATEGORY}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogUpdateCategory
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
      />
    </div>
  );
}

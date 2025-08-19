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
import { useMemo } from "react";
import { toast } from "sonner";
import DialogCreateCategory from "./dialog-create-category";

export default function CategoryManagement() {
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
    data: categories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["categories", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const result = await supabase
        .from("category")
        .select("*")
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at")
        .ilike("name", `%${currentSearch}%`);

      if (result.error)
        toast.error("Get Category Data Failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const filteredData = useMemo(() => {
    return (categories?.data || []).map((category, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        category.name,
        <span className="block truncate max-w-xs">{category.description}</span>,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            category.is_active ? "bg-green-600" : "bg-red-500"
          )}
        >
          {category.is_active ? "Active" : "Not Active"}
        </div>,
        <DropdownAction
          menu={[
            {
              label: (
                <span className=" flex items-center gap-2">
                  <Pencil />
                  Edit
                </span>
              ),
              action: () => {},
            },
            {
              label: (
                <span className=" flex items-center gap-2">
                  <Trash2 className="text-red-400" />
                  Delete
                </span>
              ),
              variant: "destructive",
              action: () => {},
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
        <h1>Category Management</h1>
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
    </div>
  );
}

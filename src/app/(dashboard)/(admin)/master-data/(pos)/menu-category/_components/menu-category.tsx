"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import type { MenuCategory } from "@/validations/pos/menu-category.validation";
import { HEADER_TABLE_MENU_CATEGORY } from "@/constants/pos/menu-category";
import DialogCreateMenuCategory from "./dialog-create-menu-category";
import DialogDeleteMenuCategory from "./dialog-delete-menu-category";
import DialogUpdateMenuCategory from "./dialog-update-menu-category";

export default function MenuCategory() {
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
    data: menuCategories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "menu_category",
      currentPage,
      currentLimit,
      currentSearch,
      currentBrandId,
      currentId,
    ],
    queryFn: async () => {
      const result = await supabase
        .from("menu_category")
        .select("id,name,status,brand_id", {
          count: "exact",
        })
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .order("name")
        .ilike("name", `%${currentSearch}%`);

      if (result.error) {
        toast.error("Get Menu Category data Failed");
      }

      return result;
    },
    enabled: !!currentId,
  });
  const [selectedAction, setSelectedAction] = useState<{
    data: MenuCategory;
    type: "detail" | "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const handleViewTable = (row: (string | ReactNode)[], rowIndex: number) => {
    // Get the raw data for this row
    const data = menuCategories?.data?.[rowIndex];
    if (data) {
      setSelectedAction({
        data,
        type: "detail",
      });
    }
  };

  const filteredData = useMemo(() => {
    return (menuCategories?.data || []).map((menuCategory, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        menuCategory.name,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            menuCategory.status ? "bg-green-600" : "bg-red-500"
          )}
        >
          {menuCategory.status ? "Active" : "Inactive"}
        </div>,
        <div className="flex  gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-6 hover:text-muted-foreground hover:!bg-muted-foreground/40"
            onClick={() => {
              setSelectedAction({
                data: menuCategory,
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
                data: menuCategory,
                type: "delete",
              });
            }}
          >
            <Trash2 />
          </Button>
        </div>,
      ];
    });
  }, [menuCategories]);

  const totalPages = useMemo(() => {
    return menuCategories && menuCategories.count !== null
      ? Math.ceil(menuCategories.count / currentLimit)
      : 0;
  }, [menuCategories]);
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-xl font-semibold">Menu Category Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by Menu Category"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogCreateMenuCategory refetch={refetch} />
          </Dialog>
        </div>
      </div>
      <DataTable
        handleView={handleViewTable}
        header={HEADER_TABLE_MENU_CATEGORY}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogUpdateMenuCategory
        open={selectedAction !== null && selectedAction.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteMenuCategory
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}

"use client";

import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import type { MenuCategory } from "@/validations/pos/menu-category.validation";
import DialogCreateMenuCategory from "./dialog-create-menu-category";
import DialogDeleteMenuCategory from "./dialog-delete-menu-category";
import DialogUpdateMenuCategory from "./dialog-update-menu-category";
import { DataTable } from "@/components/common/tanstack-table";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import DropdownAction from "@/components/common/dropdown-action";
import PageHeader from "@/components/common/page-header";

export default function MenuCategory() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();

  const {
    data: menuCategories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "menu_category",
      currentPage,
      currentSearch,
      currentBrandId,
      currentId,
      sorting,
    ],
    queryFn: async () => {
      const query = supabase
        .from("menu_category")
        .select("id,name,status,brand_id", {
          count: "exact",
        })
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .ilike("name", `%${currentSearch}%`);

      const sort = sorting[0];

      if (sort) {
        query.order(sort.id, { ascending: sort.desc ? false : true });
      } else {
        query.order("created_at", { ascending: false });
      }

      const result = await query;
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

  const data: MenuCategory[] = menuCategories?.data || [];
  const columns: ColumnDef<MenuCategory>[] = [
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
            Menu category name
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
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

  const totalData = menuCategories?.count ?? 0;

  const totalPages = useMemo(() => {
    return menuCategories && menuCategories.count !== null
      ? Math.ceil(menuCategories.count / 10)
      : 0;
  }, [menuCategories]);
  return (
    <div className="w-full">
      <PageHeader
        handleChangeSearch={handleChangeSearch}
        title="menu category"
        DialogCreateComponent={<DialogCreateMenuCategory refetch={refetch} />}
      />
      <DataTable
        data={data}
        columns={columns}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalData={totalData}
        refetch={refetch}
        sorting={sorting}
        onSortingChange={setSorting}
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

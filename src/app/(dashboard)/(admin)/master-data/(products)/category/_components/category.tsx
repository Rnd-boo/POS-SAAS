"use client";

import DropdownAction from "@/components/common/dropdown-action";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import DialogCreateCategory from "./dialog-create-category";
import DialogUpdateCategory from "./dialog-update-category";
import { Category } from "@/validations/products/category-validation";
import DialogDeleteCategory from "./dialog-delete-category";
import { useAuthStore } from "@/stores/auth-store";
import { DataTable } from "@/components/common/tanstack-table";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { applyFilterQuery } from "@/hooks/use-filter-query";
import { CATEGORY_TABLE_PRODUCT } from "@/constants/products/category.constant";
import { STATUS_LIST } from "@/constants/general.constant";
import DialogFilters from "@/components/common/dialog-filters";
import PageHeader from "@/components/common/page-header";

export default function CategoryManagement() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const {
    currentPage,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
    setTotalData,
    totalData,
  } = useDataTable();

  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "categories",
      currentPage,
      currentSearch,
      currentId,
      sorting,
      filters,
    ],
    queryFn: async () => {
      let query = supabase
        .from("categories")
        .select("id, name, description, status", { count: "exact" })
        .eq("clients_id", currentId)
        .range((currentPage - 1) * 10, currentPage * 10 - 1)
        .ilike("name", `%${currentSearch}%`);

      const sort = sorting[0];

      if (sort) {
        query.order(sort.id, { ascending: sort.desc ? false : true });
      } else {
        query.order("created_at", { ascending: false });
      }
      query = applyFilterQuery(query, filters);

      const result = await query;

      setTotalData(result.count ?? 0);

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

  const totalPages = useMemo(() => {
    return categories && categories.count !== null
      ? Math.ceil(categories.count / 10)
      : 0;
  }, [categories]);

  const data: Category[] = categories?.data || [];
  const columns: ColumnDef<Category>[] = [
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
            Category Name
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      enableHiding: false,
      header: () => <div>Description</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {row.getValue("description") !== null
            ? row.getValue("description")
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

  return (
    <div className="w-full">
      <PageHeader
        handleChangeSearch={handleChangeSearch}
        title="category"
        filters={filters}
        setFilters={setFilters}
        setOpenDialogFilters={setOpenDialogFilters}
        DialogCreateComponent={<DialogCreateCategory refetch={refetch} />}
      />
      <DataTable
        data={data}
        columns={columns}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalData={totalData}
        sorting={sorting}
        onSortingChange={setSorting}
        refetch={refetch}
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
      <DialogFilters
        configs={CATEGORY_TABLE_PRODUCT.map((config) => {
          if (config.key === "status") {
            return {
              ...config,
              options: STATUS_LIST,
            };
          }
          return config;
        })}
        onOpenChange={setOpenDialogFilters}
        open={openDialogFilters}
        onChange={setFilters}
      />
    </div>
  );
}

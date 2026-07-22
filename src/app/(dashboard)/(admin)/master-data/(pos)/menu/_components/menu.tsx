"use client";

import DialogFilters from "@/components/common/dialog/dialog-filters";
import DropdownAction from "@/components/common/dropdown-action";
import PageHeader from "@/components/common/page-header";
import { DataTable } from "@/components/common/tanstack-table";
import { STATUS_LIST } from "@/constants/general.constant";
import { MENU_TABLE_PRODUCT } from "@/constants/pos/menu.constant";
import useDataTable from "@/hooks/use-data-table";
import { applyFilterQuery } from "@/hooks/use-filter-query";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import type { Menu } from "@/validations/pos/menu.validation";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function Menu() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);
  const pathname = usePathname();
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();

  const {
    data: menus,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "menu",
      currentPage,
      currentSearch,
      currentId,
      currentBrandId,
      sorting,
      filters,
    ],
    queryFn: async () => {
      let query = supabase
        .from("menu")
        .select(
          "id,name,menu_category_id,brand_id,status,products_id,products(name),menu_category(name),items_id,auto_decrement",
          {
            count: "exact",
          },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .range((currentPage - 1) * 10, currentPage * 10 - 1)
        .ilike("name", `%${currentSearch}%`);

      const sort = sorting[0];
      if (sort) {
        query = query.order(sort.id, {
          ascending: !sort.desc,
        });
      }
      query = applyFilterQuery(query, filters);

      const result = await query;

      if (result.error)
        toast.error("Get Menu Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", currentId],
    queryFn: async () => {
      const result = await supabase
        .from("products")
        .select("id,name")
        .eq("status", true)
        .eq("clients_id", currentId);

      if (result.error)
        toast.error("Get Prouduct Data Failed", {
          description: result.error.message,
        });
      return result.data;
    },
  });

  const { data: menuCategories, isLoading: isLoadingMenuCategories } = useQuery(
    {
      queryKey: ["menu-category", currentId],
      queryFn: async () => {
        const result = await supabase
          .from("menu_category")
          .select("id,name")
          .eq("status", true)
          .eq("clients_id", currentId);

        if (result.error)
          toast.error("Get Menu category Data Failed", {
            description: result.error.message,
          });
        return result.data;
      },
    },
  );

  const [selectedAction, setSelectedAction] = useState<{
    data: Menu;
    type: "detail" | "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };
  const handleClickAction = (type: string) => {
    router.push(`${pathname}/${type}`);
  };

  const data: Menu[] = menus?.data || [];
  const columns: ColumnDef<Menu>[] = [
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
            Menu Name
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "menu_category",
      enableHiding: false,
      header: () => <div>Menu Category</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {row.getValue("menu_category") !== null
            ? (row.getValue("menu_category") as unknown as { name: string })
                .name
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "products",
      enableHiding: false,
      header: () => <div>Product</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {row.getValue("products") !== null
            ? (row.getValue("products") as unknown as { name: string }).name
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
                  handleClickAction(`${row?.original.id}/edit`);
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

  const totalData = menus?.count ?? 0;

  const totalPages = useMemo(() => {
    return menus && menus.count !== null ? Math.ceil(menus.count / 10) : 0;
  }, [menus]);

  return (
    <div className="w-full">
      <PageHeader
        title="menu"
        pathname={pathname}
        handleChangeSearch={handleChangeSearch}
        filters={filters}
        setFilters={setFilters}
        setOpenDialogFilters={setOpenDialogFilters}
      />
      <DataTable
        columns={columns}
        data={data}
        refetch={refetch}
        currentPage={currentPage}
        totalData={totalData}
        onChangePage={handleChangePage}
        totalPages={totalPages}
        onSortingChange={setSorting}
        sorting={sorting}
      />
      <DialogFilters
        configs={MENU_TABLE_PRODUCT.map((config) => {
          if (config.key === "menu_category_id") {
            return {
              ...config,
              options: menuCategories?.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            };
          } else if (config.key === "products_id") {
            return {
              ...config,
              options: products?.map((product) => ({
                value: product.id,
                label: product.name,
              })),
            };
          } else if (config.key === "status") {
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
